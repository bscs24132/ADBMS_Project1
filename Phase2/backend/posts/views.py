from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.db import connection
from .models import Post, Like, Comment
from .serializers import (
    PostSerializer, PostCreateSerializer,
    LikeSerializer, CommentSerializer, CommentCreateSerializer
)
from .utils import get_user_info, get_users_info


class PostListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        page = int(request.GET.get('page', 1))
        page_size = int(request.GET.get('page_size', 20))
        offset = (page - 1) * page_size

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, notebook_id, author_id, content, image, created_at
                FROM posts
                WHERE notebook_id IS NULL
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s
            """, [page_size, offset])

            columns = [col[0] for col in cursor.description]
            posts_data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        author_ids = [p['author_id'] for p in posts_data]
        users_info = get_users_info(author_ids)

        posts = []
        for p_data in posts_data:
            post = Post(
                id=p_data['id'],
                notebook_id=p_data['notebook_id'],
                author_id=p_data['author_id'],
                content=p_data['content'],
                image=p_data['image'],
                created_at=p_data['created_at']
            )
            post._author = users_info.get(p_data['author_id'])
            posts.append(post)

        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response({
            'page': page,
            'page_size': page_size,
            'results': serializer.data
        })

    def post(self, request):
        # RBAC: only writers and users can create posts, admin cannot
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if request.user.role not in ['writer', 'user']:
            return Response(
                {'error': 'Only writers and users can create posts'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PostCreateSerializer(data=request.data)
        if serializer.is_valid():
            with connection.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO posts (author_id, content, image, notebook_id, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                """, [
                    request.user.id,
                    serializer.validated_data['content'],
                    serializer.validated_data.get('image', ''),
                    serializer.validated_data.get('notebook_id')
                ])

                cursor.execute("SELECT LAST_INSERT_ID()")
                post_id = cursor.fetchone()[0]

                cursor.execute("""
                    SELECT id, notebook_id, author_id, content, image, created_at
                    FROM posts WHERE id = %s
                """, [post_id])
                row = cursor.fetchone()

            if row:
                post = Post(
                    id=row[0],
                    notebook_id=row[1],
                    author_id=row[2],
                    content=row[3],
                    image=row[4],
                    created_at=row[5]
                )
                post._author = {
                    'id': request.user.id,
                    'username': request.user.username,
                    'profile_picture': getattr(request.user, 'profile_picture', ''),
                    'role': getattr(request.user, 'role', 'user')
                }

                response_serializer = PostSerializer(post, context={'request': request})
                return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, post_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, notebook_id, author_id, content, image, created_at
                FROM posts WHERE id = %s
            """, [post_id])
            row = cursor.fetchone()

        if not row:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        post = Post(
            id=row[0],
            notebook_id=row[1],
            author_id=row[2],
            content=row[3],
            image=row[4],
            created_at=row[5]
        )

        author_info = get_user_info(post.author_id)
        post._author = author_info

        serializer = PostSerializer(post, context={'request': request})
        return Response(serializer.data)

    def put(self, request, post_id):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT author_id FROM posts WHERE id = %s",
                [post_id]
            )
            row = cursor.fetchone()

        if not row:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # RBAC: only post owner can edit their post
        if row[0] != request.user.id:
            return Response(
                {'error': 'You can only edit your own posts'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = PostCreateSerializer(data=request.data, partial=True)
        if serializer.is_valid():
            updates = []
            params = []

            if 'content' in serializer.validated_data:
                updates.append("content = %s")
                params.append(serializer.validated_data['content'])

            if 'image' in serializer.validated_data:
                updates.append("image = %s")
                params.append(serializer.validated_data['image'])

            if updates:
                params.append(post_id)
                with connection.cursor() as cursor:
                    cursor.execute(f"""
                        UPDATE posts
                        SET {', '.join(updates)}
                        WHERE id = %s
                    """, params)

            return self.get(request, post_id)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, post_id):
        if not request.user.is_authenticated:
            return Response(
                {'error': 'Authentication required'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT author_id FROM posts WHERE id = %s",
                [post_id]
            )
            row = cursor.fetchone()

        if not row:
            return Response(
                {'error': 'Post not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # RBAC: post owner can delete their own post, admin can delete anyone's post
        if row[0] != request.user.id and request.user.role != 'admin':
            return Response(
                {'error': 'You can only delete your own posts'},
                status=status.HTTP_403_FORBIDDEN
            )

        with connection.cursor() as cursor:
            cursor.execute("DELETE FROM posts WHERE id = %s", [post_id])

        return Response(status=status.HTTP_204_NO_CONTENT)


class UserPostsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, notebook_id, author_id, content, image, created_at
                FROM posts
                WHERE author_id = %s AND notebook_id IS NULL
                ORDER BY created_at DESC
            """, [user_id])

            columns = [col[0] for col in cursor.description]
            posts_data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        author_info = get_user_info(user_id)

        posts = []
        for p_data in posts_data:
            post = Post(
                id=p_data['id'],
                notebook_id=p_data['notebook_id'],
                author_id=p_data['author_id'],
                content=p_data['content'],
                image=p_data['image'],
                created_at=p_data['created_at']
            )
            post._author = author_info
            posts.append(post)

        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class FollowingFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT p.id, p.notebook_id, p.author_id, p.content, p.image, p.created_at
                FROM posts p
                WHERE p.author_id IN (
                    SELECT following_id FROM follows WHERE follower_id = %s
                )
                AND p.notebook_id IS NULL
                ORDER BY p.created_at DESC
                LIMIT 50
            """, [request.user.id])

            columns = [col[0] for col in cursor.description]
            posts_data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        author_ids = list(set(p['author_id'] for p in posts_data))
        users_info = get_users_info(author_ids)

        posts = []
        for p_data in posts_data:
            post = Post(
                id=p_data['id'],
                notebook_id=p_data['notebook_id'],
                author_id=p_data['author_id'],
                content=p_data['content'],
                image=p_data['image'],
                created_at=p_data['created_at']
            )
            post._author = users_info.get(p_data['author_id'])
            posts.append(post)

        serializer = PostSerializer(posts, many=True, context={'request': request})
        return Response(serializer.data)


class LikeToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        # RBAC: any authenticated user can like/unlike posts
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM posts WHERE id = %s", [post_id])
            if not cursor.fetchone():
                return Response(
                    {'error': 'Post not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            cursor.execute("""
                SELECT COUNT(*) FROM likes
                WHERE user_id = %s AND post_id = %s
            """, [request.user.id, post_id])
            count = cursor.fetchone()[0]

            if count > 0:
                cursor.execute("""
                    DELETE FROM likes
                    WHERE user_id = %s AND post_id = %s
                """, [request.user.id, post_id])
                return Response({'liked': False, 'message': 'Post unliked'})
            else:
                cursor.execute("""
                    INSERT INTO likes (user_id, post_id, created_at)
                    VALUES (%s, %s, NOW())
                """, [request.user.id, post_id])
                return Response({'liked': True, 'message': 'Post liked'})


class PostLikesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, post_id):
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM posts WHERE id = %s", [post_id])
            if not cursor.fetchone():
                return Response(
                    {'error': 'Post not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            cursor.execute("""
                SELECT u.id, u.username, u.profile_picture, u.role, l.created_at
                FROM likes l
                JOIN users u ON l.user_id = u.id
                WHERE l.post_id = %s
                ORDER BY l.created_at DESC
            """, [post_id])

            columns = [col[0] for col in cursor.description]
            likes = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({
            'post_id': post_id,
            'likes_count': len(likes),
            'likes': likes
        })


class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        # RBAC: any authenticated user can comment
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM posts WHERE id = %s", [post_id])
            if not cursor.fetchone():
                return Response(
                    {'error': 'Post not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            content = request.data.get('content')
            if not content or not content.strip():
                return Response(
                    {'error': 'Comment content cannot be empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cursor.execute("""
                INSERT INTO comments (user_id, post_id, content, created_at)
                VALUES (%s, %s, %s, NOW())
            """, [request.user.id, post_id, content])

            cursor.execute("SELECT LAST_INSERT_ID()")
            comment_id = cursor.fetchone()[0]

            cursor.execute("""
                SELECT id, user_id, post_id, content, created_at
                FROM comments WHERE id = %s
            """, [comment_id])
            row = cursor.fetchone()

        author = get_user_info(request.user.id)

        return Response({
            'id': row[0],
            'user_id': row[1],
            'post_id': row[2],
            'content': row[3],
            'created_at': row[4],
            'author': author
        }, status=status.HTTP_201_CREATED)


class PostCommentsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, post_id):
        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM posts WHERE id = %s", [post_id])
            if not cursor.fetchone():
                return Response(
                    {'error': 'Post not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            cursor.execute("""
                SELECT id, user_id, post_id, content, created_at
                FROM comments
                WHERE post_id = %s
                ORDER BY created_at ASC
            """, [post_id])

            columns = [col[0] for col in cursor.description]
            comments_data = [dict(zip(columns, row)) for row in cursor.fetchall()]

        author_ids = list(set(c['user_id'] for c in comments_data))
        authors = get_users_info(author_ids)

        for comment in comments_data:
            comment['author'] = authors.get(comment['user_id'])

        return Response({
            'post_id': post_id,
            'comments_count': len(comments_data),
            'comments': comments_data
        })


class CommentUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, comment_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT user_id, content FROM comments WHERE id = %s
            """, [comment_id])
            row = cursor.fetchone()

            if not row:
                return Response(
                    {'error': 'Comment not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # RBAC: only comment owner can edit their comment
            if row[0] != request.user.id:
                return Response(
                    {'error': 'You can only edit your own comments'},
                    status=status.HTTP_403_FORBIDDEN
                )

            content = request.data.get('content')
            if not content or not content.strip():
                return Response(
                    {'error': 'Comment content cannot be empty'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            cursor.execute("""
                UPDATE comments
                SET content = %s
                WHERE id = %s
            """, [content, comment_id])

            cursor.execute("""
                SELECT id, user_id, post_id, content, created_at
                FROM comments WHERE id = %s
            """, [comment_id])
            updated_row = cursor.fetchone()

        author = get_user_info(request.user.id)

        return Response({
            'id': updated_row[0],
            'user_id': updated_row[1],
            'post_id': updated_row[2],
            'content': updated_row[3],
            'created_at': updated_row[4],
            'author': author
        })


class CommentDeleteView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, comment_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT user_id FROM comments WHERE id = %s
            """, [comment_id])
            row = cursor.fetchone()

            if not row:
                return Response(
                    {'error': 'Comment not found'},
                    status=status.HTTP_404_NOT_FOUND
                )

            # RBAC: only comment owner can delete their comment
            if row[0] != request.user.id:
                return Response(
                    {'error': 'You can only delete your own comments'},
                    status=status.HTTP_403_FORBIDDEN
                )

            cursor.execute("DELETE FROM comments WHERE id = %s", [comment_id])

        return Response(status=status.HTTP_204_NO_CONTENT)


from django.db import transaction


class CreateNotebookPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notebook_id):
        # RBAC: only writers can post writings inside notebooks
        if request.user.role != 'writer':
            return Response(
                {'error': 'Only writers can post writings in notebooks'},
                status=status.HTTP_403_FORBIDDEN
            )

        user_id = request.user.id
        content = request.data.get('content')
        image = request.data.get('image', '')

        if not content or not content.strip():
            return Response(
                {'error': 'Content cannot be empty'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        SELECT id, author_id FROM notebooks
                        WHERE id = %s
                    """, [notebook_id])
                    notebook = cursor.fetchone()

                    if not notebook:
                        return Response(
                            {'error': 'Notebook not found'},
                            status=status.HTTP_404_NOT_FOUND
                        )

                    # RBAC: writer must own the notebook they are posting in
                    if notebook[1] != user_id:
                        return Response(
                            {'error': 'You can only post in your own notebooks'},
                            status=status.HTTP_403_FORBIDDEN
                        )

                    cursor.execute("""
                        INSERT INTO posts (notebook_id, author_id, content, image, created_at)
                        VALUES (%s, %s, %s, %s, NOW())
                    """, [notebook_id, user_id, content, image])

                    cursor.execute("SELECT LAST_INSERT_ID()")
                    post_id = cursor.fetchone()[0]

                    cursor.execute("""
                        SELECT id, notebook_id, author_id, content, image, created_at
                        FROM posts WHERE id = %s
                    """, [post_id])
                    post_row = cursor.fetchone()

                return Response({
                    'id': post_row[0],
                    'notebook_id': post_row[1],
                    'author_id': post_row[2],
                    'content': post_row[3],
                    'image': post_row[4],
                    'created_at': post_row[5],
                    'message': 'Writing posted successfully in notebook'
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Failed to create writing: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )