from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.db import connection
from django.contrib.auth.hashers import check_password, make_password
from .models import User
from .serializers import UserProfileSerializer, RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken()
            refresh['user_id'] = user.id
            refresh['username'] = user.username
            refresh['role'] = user.role

            return Response({
                'user': UserProfileSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        login = request.data.get('username') or request.data.get('email')
        password = request.data.get('password')

        if not login or not password:
            return Response(
                {'error': 'Username/email and password required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with connection.cursor() as cursor:
            if '@' in login:
                cursor.execute("SELECT id, username, password FROM users WHERE email = %s", [login])
            else:
                cursor.execute("SELECT id, username, password FROM users WHERE username = %s", [login])

            row = cursor.fetchone()

        if not row:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        user_id, username, hashed_password = row

        if check_password(password, hashed_password):

            user = User(id=user_id, username=username)

            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT bio, profile_picture, role, date_joined, email FROM users WHERE id = %s",
                    [user_id]
                )
                bio, profile_picture, role, date_joined, email = cursor.fetchone()

                user.bio = bio
                user.profile_picture = profile_picture
                user.role = role
                user.date_joined = date_joined
                user.email = email

            refresh = RefreshToken()
            refresh['user_id'] = user.id
            refresh['username'] = user.username
            refresh['role'] = user.role

            return Response({
                'user': UserProfileSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            })

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')

        if not refresh_token:
            return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except TokenError:
            return Response({'error': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PublicProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            serializer = UserProfileSerializer(user)
            return Response(serializer.data)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)


class FollowToggleView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.id == user_id:
            return Response({'error': 'You cannot follow yourself'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM follows WHERE follower_id = %s AND following_id = %s",
                [request.user.id, user_id]
            )
            count = cursor.fetchone()[0]

            if count > 0:
                cursor.execute(
                    "DELETE FROM follows WHERE follower_id = %s AND following_id = %s",
                    [request.user.id, user_id]
                )
                return Response({'following': False, 'message': 'Unfollowed successfully'})
            else:
                cursor.execute(
                    "INSERT INTO follows (follower_id, following_id, created_at) VALUES (%s, %s, NOW())",
                    [request.user.id, user_id]
                )
                return Response({'following': True, 'message': 'Followed successfully'})


class FollowersListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT u.id, u.username, u.profile_picture, u.bio, u.role
                FROM follows f
                JOIN users u ON f.follower_id = u.id
                WHERE f.following_id = %s
                ORDER BY f.created_at DESC
            """, [user_id])

            columns = [col[0] for col in cursor.description]
            followers = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({'followers': followers, 'count': len(followers)})


class FollowingListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        try:
            User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT u.id, u.username, u.profile_picture, u.bio, u.role
                FROM follows f
                JOIN users u ON f.following_id = u.id
                WHERE f.follower_id = %s
                ORDER BY f.created_at DESC
            """, [user_id])

            columns = [col[0] for col in cursor.description]
            following = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({'following': following, 'count': len(following)})


class FollowingFeedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT p.id, p.content, p.image, p.created_at,
                       u.id as author_id, u.username as author_name, u.profile_picture,
                       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as like_count,
                       (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comment_count
                FROM posts p
                JOIN users u ON p.author_id = u.id
                JOIN follows f ON f.following_id = p.author_id
                WHERE f.follower_id = %s
                  AND p.notebook_id IS NULL
                ORDER BY p.created_at DESC
            """, [request.user.id])

            columns = [col[0] for col in cursor.description]
            posts = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({'posts': posts})


class WalletView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT coin_balance, updated_at FROM wallets WHERE user_id = %s",
                [request.user.id]
            )
            row = cursor.fetchone()

        if not row:
            return Response({'error': 'Wallet not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response({
            'user_id': request.user.id,
            'coin_balance': row[0],
            'updated_at': row[1]
        })


class WalletTransactionsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT t.book_id, b.title, b.cover_image, t.coins_spent, t.purchased_at,
                       u.username as author_name
                FROM transactions t
                JOIN books b ON t.book_id = b.id
                JOIN users u ON b.author_id = u.id
                WHERE t.user_id = %s
                ORDER BY t.purchased_at DESC
            """, [request.user.id])

            columns = [col[0] for col in cursor.description]
            transactions = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response({'transactions': transactions})


class AdminAddCoinsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, user_id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        amount = request.data.get('amount')

        if not amount or not str(amount).isdigit() or int(amount) <= 0:
            return Response({'error': 'A valid positive coin amount is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE wallets SET coin_balance = coin_balance + %s WHERE user_id = %s",
                [int(amount), user_id]
            )
            cursor.execute(
                "SELECT coin_balance FROM wallets WHERE user_id = %s",
                [user_id]
            )
            new_balance = cursor.fetchone()[0]

        return Response({
            'message': f'Successfully added {amount} coins',
            'user_id': user_id,
            'new_balance': new_balance
        })


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')

        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if there's already a pending request for this user
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM password_reset_requests WHERE user_id = %s AND status = 'pending'",
                [user.id]
            )
            existing = cursor.fetchone()[0]

        if existing > 0:
            return Response({'error': 'A reset request is already pending for this account'}, status=status.HTTP_400_BAD_REQUEST)

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO password_reset_requests (user_id, email) VALUES (%s, %s)",
                [user.id, email]
            )

        return Response({'message': 'Password reset request submitted. Please wait for admin approval.'}, status=status.HTTP_201_CREATED)


class AdminPasswordResetListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT r.id, r.user_id, u.username, r.email,
                       r.requested_at, r.status
                FROM password_reset_requests r
                JOIN users u ON r.user_id = u.id
                WHERE r.status = 'pending'
                ORDER BY r.requested_at DESC
            """)

            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(results)


# Admin just approves the request — no password set here
class ProcessPasswordResetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT user_id, status FROM password_reset_requests WHERE id = %s",
                [id]
            )
            row = cursor.fetchone()

            if not row:
                return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

            user_id, current_status = row

            if current_status != 'pending':
                return Response({'error': 'Request already processed or cancelled'}, status=status.HTTP_400_BAD_REQUEST)

            cursor.execute(
                "UPDATE password_reset_requests SET status = 'processed' WHERE id = %s",
                [id]
            )

        return Response({'message': 'Request approved. User can now reset their password.'}, status=status.HTTP_200_OK)


# User sets their own new password after admin approves
class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        if not email or not new_password:
            return Response({'error': 'Email and new_password are required'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if user exists
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Check if there's an approved (processed) reset request for this user
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id FROM password_reset_requests
                WHERE user_id = %s AND status = 'processed'
                ORDER BY requested_at DESC
                LIMIT 1
            """, [user.id])
            row = cursor.fetchone()

        if not row:
            return Response(
                {'error': 'No approved reset request found. Please submit a reset request first.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        reset_request_id = row[0]

        # Hash and update the password
        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                [make_password(new_password), user.id]
            )
            # Mark the request as cancelled so it can't be reused
            cursor.execute(
                "UPDATE password_reset_requests SET status = 'cancelled' WHERE id = %s",
                [reset_request_id]
            )

        return Response({'message': 'Password updated successfully. You can now log in.'}, status=status.HTTP_200_OK)