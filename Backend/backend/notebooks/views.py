from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from django.db import connection
from .models import Notebook
from .serializers import NotebookSerializer


class NotebookListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT n.id, n.title, n.description, n.author_id,
                       u.username as author_username, n.is_approved, n.created_at
                FROM notebooks n
                JOIN users u ON n.author_id = u.id
                ORDER BY n.created_at DESC
            """)
            columns = [col[0] for col in cursor.description]
            notebooks = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(notebooks)

    def post(self, request):
        if request.user.role != 'writer':
            return Response(
                {'error': 'Only writers can create notebooks'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = NotebookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class NotebookDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, notebook_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT n.id, n.title, n.description, n.author_id,
                       u.username as author_username, n.is_approved, n.created_at
                FROM notebooks n
                JOIN users u ON n.author_id = u.id
                WHERE n.id = %s
            """, [notebook_id])
            row = cursor.fetchone()
            columns = [col[0] for col in cursor.description]

        if not row:
            return Response({'error': 'Notebook not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(dict(zip(columns, row)))

    def put(self, request, notebook_id):
        try:
            notebook = Notebook.objects.get(id=notebook_id)
        except Notebook.DoesNotExist:
            return Response({'error': 'Notebook not found'}, status=status.HTTP_404_NOT_FOUND)

        if notebook.author_id != request.user.id:
            return Response(
                {'error': 'You can only edit your own notebooks'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = NotebookSerializer(notebook, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, notebook_id):
        try:
            notebook = Notebook.objects.get(id=notebook_id)
        except Notebook.DoesNotExist:
            return Response({'error': 'Notebook not found'}, status=status.HTTP_404_NOT_FOUND)

        if notebook.author_id != request.user.id and request.user.role != 'admin':
            return Response(
                {'error': 'You can only delete your own notebooks'},
                status=status.HTTP_403_FORBIDDEN
            )

        notebook.delete()
        return Response({'message': 'Notebook deleted'}, status=status.HTTP_204_NO_CONTENT)


class WriterNotebooksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT n.id, n.title, n.description, n.author_id,
                       u.username as author_username, n.is_approved, n.created_at
                FROM notebooks n
                JOIN users u ON n.author_id = u.id
                WHERE n.author_id = %s
                ORDER BY n.created_at DESC
            """, [user_id])
            columns = [col[0] for col in cursor.description]
            notebooks = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(notebooks)


class NotebookPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notebook_id):
        # RBAC: only writers can post writings in notebooks
        if request.user.role != 'writer':
            return Response(
                {'error': 'Only writers can post writings in notebooks'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verify notebook exists and writer owns it
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id, author_id FROM notebooks WHERE id = %s",
                [notebook_id]
            )
            notebook = cursor.fetchone()

        if not notebook:
            return Response({'error': 'Notebook not found'}, status=status.HTTP_404_NOT_FOUND)

        if notebook[1] != request.user.id:
            return Response(
                {'error': 'You can only post in your own notebooks'},
                status=status.HTTP_403_FORBIDDEN
            )

        content = request.data.get('content')
        image = request.data.get('image', None)

        if not content:
            return Response({'error': 'Content is required'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            try:
                cursor.execute("BEGIN")

                cursor.execute("""
                    INSERT INTO posts (notebook_id, author_id, content, image, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                """, [notebook_id, request.user.id, content, image])

                post_id = cursor.lastrowid

                cursor.execute("""
                    SELECT p.id, p.notebook_id, p.author_id, u.username as author_username,
                           p.content, p.image, p.created_at
                    FROM posts p
                    JOIN users u ON p.author_id = u.id
                    WHERE p.id = %s
                """, [post_id])
                columns = [col[0] for col in cursor.description]
                post = dict(zip(columns, cursor.fetchone()))

                cursor.execute("COMMIT")

                return Response(post, status=status.HTTP_201_CREATED)

            except Exception as e:
                cursor.execute("ROLLBACK")
                return Response(
                    {'error': f'Failed to create post: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )