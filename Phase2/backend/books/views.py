from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAuthenticatedOrReadOnly
from rest_framework import status
from django.db import connection
from .models import Book
from .serializers import BookSerializer


class BookListView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request):
        search_query = request.GET.get('search', '')

        with connection.cursor() as cursor:
            if search_query:
                cursor.execute("""
                    SELECT b.id, b.title, b.description, b.author_id,
                           u.username as author_username, b.coin_price,
                           b.cover_image, b.is_approved, b.created_at
                    FROM books b
                    JOIN users u ON b.author_id = u.id
                    WHERE b.is_approved = 1 AND b.title LIKE %s
                    ORDER BY
                        CASE
                            WHEN b.title LIKE %s THEN 1
                            WHEN b.title LIKE %s THEN 2
                            ELSE 3
                        END,
                        b.created_at DESC
                """, [f'%{search_query}%', f'{search_query}%', f'%{search_query}%'])
            else:
                cursor.execute("""
                    SELECT b.id, b.title, b.description, b.author_id,
                           u.username as author_username, b.coin_price,
                           b.cover_image, b.is_approved, b.created_at
                    FROM books b
                    JOIN users u ON b.author_id = u.id
                    WHERE b.is_approved = 1
                    ORDER BY b.created_at DESC
                """)

            columns = [col[0] for col in cursor.description]
            books = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(books)

    def post(self, request):
        if request.user.role != 'writer':
            return Response(
                {'error': 'Only writers can upload books'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = BookSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BookDetailView(APIView):
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get(self, request, book_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT b.id, b.title, b.description, b.content, b.author_id,
                       u.username as author_username, b.coin_price,
                       b.cover_image, b.is_approved, b.created_at
                FROM books b
                JOIN users u ON b.author_id = u.id
                WHERE b.id = %s
            """, [book_id])
            row = cursor.fetchone()
            columns = [col[0] for col in cursor.description]

        if not row:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(dict(zip(columns, row)))

    def put(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        if book.author_id != request.user.id:
            return Response(
                {'error': 'You can only edit your own books'},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = BookSerializer(book, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, book_id):
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        if book.author_id != request.user.id and request.user.role != 'admin':
            return Response(
                {'error': 'Only the book owner or admin can delete this book'},
                status=status.HTTP_403_FORBIDDEN
            )

        book.delete()
        return Response({'message': 'Book deleted'}, status=status.HTTP_204_NO_CONTENT)


class WriterBooksView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, user_id):
        with connection.cursor() as cursor:
            # ── FIX: use book_stats view which includes no_of_sales and total_revenue ──
            cursor.execute("""
                SELECT
                    bs.id,
                    bs.title,
                    bs.description,
                    bs.author_id,
                    bs.author_name as author_username,
                    bs.coin_price,
                    bs.cover_image,
                    bs.created_at,
                    b.is_approved,
                    COALESCE(bs.no_of_sales, 0)    as no_of_sales,
                    COALESCE(bs.total_revenue, 0)  as total_revenue
                FROM book_stats bs
                JOIN books b ON bs.id = b.id
                WHERE bs.author_id = %s
                ORDER BY bs.created_at DESC
            """, [user_id])
            columns = [col[0] for col in cursor.description]
            books = [dict(zip(columns, row)) for row in cursor.fetchall()]

        return Response(books)


class PurchaseBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        with connection.cursor() as cursor:
            try:
                cursor.execute("BEGIN")

                cursor.execute(
                    "SELECT id, coin_price, is_approved FROM books WHERE id = %s FOR UPDATE",
                    [book_id]
                )
                book = cursor.fetchone()

                if not book:
                    cursor.execute("ROLLBACK")
                    return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

                if not book[2]:
                    cursor.execute("ROLLBACK")
                    return Response(
                        {'error': 'Book is not available for purchase'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                coin_price = book[1]

                cursor.execute("""
                    SELECT COUNT(*) FROM transactions
                    WHERE user_id = %s AND book_id = %s
                """, [request.user.id, book_id])
                if cursor.fetchone()[0] > 0:
                    cursor.execute("ROLLBACK")
                    return Response(
                        {'error': 'You already own this book'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                cursor.execute(
                    "SELECT coin_balance FROM wallets WHERE user_id = %s FOR UPDATE",
                    [request.user.id]
                )
                wallet = cursor.fetchone()

                if not wallet or wallet[0] < coin_price:
                    cursor.execute("ROLLBACK")
                    return Response(
                        {'error': 'Insufficient coins'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                cursor.execute("""
                    INSERT INTO transactions (user_id, book_id, coins_spent, purchased_at)
                    VALUES (%s, %s, %s, NOW())
                """, [request.user.id, book_id, coin_price])

                cursor.execute(
                    "SELECT coin_balance FROM wallets WHERE user_id = %s",
                    [request.user.id]
                )
                new_balance = cursor.fetchone()[0]

                cursor.execute("COMMIT")

                return Response({
                    'message': 'Book purchased successfully',
                    'coins_spent': coin_price,
                    'remaining_balance': new_balance
                })

            except Exception as e:
                cursor.execute("ROLLBACK")
                return Response(
                    {'error': f'Purchase failed: {str(e)}'},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )


class AdminPendingBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT b.id, b.title, b.description, b.author_id,
                       u.username as author_username, b.coin_price,
                       b.cover_image, b.is_approved, b.created_at
                FROM books b
                JOIN users u ON b.author_id = u.id
                WHERE b.is_approved = 0
                ORDER BY b.created_at DESC
            """)
            columns = [col[0] for col in cursor.description]
            books = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(books)


class AdminPendingBookDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, book_id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT b.id, b.title, b.description, b.content, b.author_id,
                       u.username as author_username, b.coin_price,
                       b.cover_image, b.is_approved, b.created_at
                FROM books b
                JOIN users u ON b.author_id = u.id
                WHERE b.id = %s AND b.is_approved = 0
            """, [book_id])
            row = cursor.fetchone()
            columns = [col[0] for col in cursor.description]

        if not row:
            return Response({'error': 'Pending book not found'}, status=status.HTTP_404_NOT_FOUND)

        return Response(dict(zip(columns, row)))


class AdminApproveBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM books WHERE id = %s", [book_id])
            if not cursor.fetchone():
                return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

            cursor.execute("UPDATE books SET is_approved = 1 WHERE id = %s", [book_id])

        return Response({'message': 'Book approved successfully'})


class AdminRejectBookView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, book_id):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute("SELECT id FROM books WHERE id = %s", [book_id])
            if not cursor.fetchone():
                return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

            cursor.execute("DELETE FROM books WHERE id = %s", [book_id])

        return Response({'message': 'Book rejected and removed'})


class AdminApprovedBooksView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if request.user.role != 'admin':
            return Response({'error': 'Admin access required'}, status=status.HTTP_403_FORBIDDEN)

        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT b.id, b.title, b.description, b.author_id,
                       u.username as author_username, b.coin_price,
                       b.cover_image, b.is_approved, b.created_at
                FROM books b
                JOIN users u ON b.author_id = u.id
                WHERE b.is_approved = 1
                ORDER BY b.created_at DESC
            """)
            columns = [col[0] for col in cursor.description]
            books = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(books)