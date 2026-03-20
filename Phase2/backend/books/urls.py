from django.urls import path
from .views import (
    BookListView, BookDetailView, WriterBooksView, PurchaseBookView,
    AdminPendingBooksView, AdminPendingBookDetailView, AdminApproveBookView,
    AdminRejectBookView, AdminApprovedBooksView
)

urlpatterns = [
    path('', BookListView.as_view(), name='books-list'),
    path('<int:book_id>/', BookDetailView.as_view(), name='book-detail'),
    path('writer/<int:user_id>/', WriterBooksView.as_view(), name='writer-books'),
    path('<int:book_id>/purchase/', PurchaseBookView.as_view(), name='book-purchase'),

    # Admin endpoints
    path('admin/pending/', AdminPendingBooksView.as_view(), name='admin-pending-books'),
    path('admin/pending/<int:book_id>/', AdminPendingBookDetailView.as_view(), name='admin-pending-book-detail'),
    path('admin/<int:book_id>/approve/', AdminApproveBookView.as_view(), name='admin-approve-book'),
    path('admin/<int:book_id>/reject/', AdminRejectBookView.as_view(), name='admin-reject-book'),
    path('admin/approved/', AdminApprovedBooksView.as_view(), name='admin-approved-books'),
    
]