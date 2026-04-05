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
from django.db import transaction


class UserSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        search_query = request.GET.get('search', '')

        with connection.cursor() as cursor:
            if search_query:
                cursor.execute("""
                    SELECT id, username, bio, profile_picture, role, date_joined
                    FROM users 
                    WHERE username LIKE %s
                    ORDER BY 
                        CASE 
                            WHEN username = %s THEN 1
                            WHEN username LIKE %s THEN 2
                            ELSE 3
                        END,
                        username ASC
                    LIMIT 50
                """, [f'%{search_query}%', search_query, f'{search_query}%'])
            else:
                cursor.execute("""
                    SELECT id, username, bio, profile_picture, role, date_joined
                    FROM users 
                    ORDER BY username ASC
                    LIMIT 50
                """)

            columns = [col[0] for col in cursor.description]
            users = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(users)


class CoinPurchasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, coins_purchased, account_no, amount_paid, purchased_at
                FROM coin_purchases
                WHERE user_id = %s
                ORDER BY purchased_at DESC
            """, [request.user.id])

            columns = [col[0] for col in cursor.description]
            purchases = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(purchases)


class BuyCoinsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        coins = request.data.get('coins')
        account_no = request.data.get('account_no')
        amount = request.data.get('amount')

        if not coins or not account_no or not amount:
            return Response(
                {'error': 'coins, account_no, and amount are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            coins = int(coins)
            amount = float(amount)
        except (ValueError, TypeError):
            return Response(
                {'error': 'coins must be integer, amount must be number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if coins <= 0 or amount <= 0:
            return Response(
                {'error': 'coins and amount must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(account_no) < 5:
            return Response(
                {'error': 'account_no must be at least 5 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            with transaction.atomic():
                with connection.cursor() as cursor:
                    cursor.execute("""
                        INSERT INTO coin_purchases 
                        (user_id, coins_purchased, account_no, amount_paid, purchased_at)
                        VALUES (%s, %s, %s, %s, NOW())
                    """, [request.user.id, coins, account_no, amount])

                    purchase_id = cursor.lastrowid

                    cursor.execute("""
                        UPDATE wallets 
                        SET coin_balance = coin_balance + %s, updated_at = NOW()
                        WHERE user_id = %s
                    """, [coins, request.user.id])

                    cursor.execute("""
                        SELECT coin_balance FROM wallets WHERE user_id = %s
                    """, [request.user.id])
                    new_balance = cursor.fetchone()[0]

                return Response({
                    'message': 'Coins purchased successfully',
                    'purchase_id': purchase_id,
                    'coins_added': coins,
                    'amount_paid': amount,
                    'account_no': account_no[-4:].rjust(len(account_no), '*'),
                    'new_balance': new_balance
                }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {'error': f'Purchase failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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
        try:
            refresh_token = request.data.get('refresh')

            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {'message': 'Successfully logged out'},
                status=status.HTTP_200_OK
            )

        except TokenError:
            return Response(
                {'error': 'Invalid or expired token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': f'Logout failed: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT id, username, bio, profile_picture, role, date_joined, email
                FROM users WHERE id = %s
            """, [request.user.id])
            row = cursor.fetchone()
            columns = [col[0] for col in cursor.description]

        if not row:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(dict(zip(columns, row)))

    def put(self, request):
        user = request.user
        data = request.data

        if 'bio' in data:
            user.bio = data['bio']
        if 'profile_picture' in data:
            user.profile_picture = data['profile_picture']

        user.save()

        serializer = UserProfileSerializer(user)
        return Response(serializer.data)


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
                SELECT t.*, b.title as book_title
                FROM transactions t
                JOIN books b ON t.book_id = b.id
                WHERE t.user_id = %s
                ORDER BY t.purchased_at DESC
            """, [request.user.id])

            columns = [col[0] for col in cursor.description]
            transactions = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(transactions)


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

        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT COUNT(*) FROM password_reset_requests WHERE user_id = %s AND status = 'pending'",
                [user.id]
            )
            existing = cursor.fetchone()[0]

        if existing > 0:
            return Response(
                {'error': 'A reset request is already pending for this account'},
                status=status.HTTP_400_BAD_REQUEST
            )

        with connection.cursor() as cursor:
            cursor.execute(
                "INSERT INTO password_reset_requests (user_id, email) VALUES (%s, %s)",
                [user.id, email]
            )

        return Response(
            {'message': 'Password reset request submitted. Please wait for admin approval.'},
            status=status.HTTP_201_CREATED
        )


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
                ORDER BY r.requested_at DESC
            """)

            columns = [col[0] for col in cursor.description]
            results = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(results)


class ProcessPasswordResetView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        action = request.data.get('action')
        if action not in ['approve', 'reject']:
            return Response(
                {'error': 'action must be approve or reject'},
                status=status.HTTP_400_BAD_REQUEST
            )

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
                return Response(
                    {'error': 'Request already processed or cancelled'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            if action == 'reject':
                cursor.execute(
                    "UPDATE password_reset_requests SET status = 'cancelled' WHERE id = %s",
                    [id]
                )
                return Response({'message': 'Password request rejected.'}, status=status.HTTP_200_OK)

            # ── APPROVE: admin provides new password manually ──
            new_password = request.data.get('new_password', '').strip()

            if not new_password:
                return Response(
                    {'error': 'new_password is required when approving'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Same validation rules as registration
            if len(new_password) < 8:
                return Response(
                    {'error': 'Password must be at least 8 characters'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not any(c.isdigit() for c in new_password):
                return Response(
                    {'error': 'Password must contain at least one number'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            if not any(c in '!@#$%^&*(),.?":{}|<>' for c in new_password):
                return Response(
                    {'error': 'Password must contain at least one symbol (!@#$%^&* etc.)'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Hash and save
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                [make_password(new_password), user_id]
            )
            cursor.execute(
                "UPDATE password_reset_requests SET status = 'processed' WHERE id = %s",
                [id]
            )
            cursor.execute("SELECT email, username FROM users WHERE id = %s", [user_id])
            user_row = cursor.fetchone()
            email, username = user_row if user_row else ('', '')

        return Response({
            'message': 'Password updated. Send the new password to the user via email.',
            'username': username,
            'email': email,
            'new_password': new_password,
        }, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        new_password = request.data.get('new_password')

        if not email or not new_password:
            return Response(
                {'error': 'Email and new_password are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

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

        with connection.cursor() as cursor:
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                [make_password(new_password), user.id]
            )
            cursor.execute(
                "UPDATE password_reset_requests SET status = 'cancelled' WHERE id = %s",
                [reset_request_id]
            )

        return Response(
            {'message': 'Password updated successfully. You can now log in.'},
            status=status.HTTP_200_OK
        )