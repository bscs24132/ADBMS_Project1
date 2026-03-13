from django.urls import path
from . import views
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.contrib import admin
from django.urls import path, include
from rest_framework import permissions
# Schema view configuration
schema_view = get_schema_view(
    openapi.Info(
        title="Readers & Writers API",
        default_version='v1',
        description="API for social media platform for book lovers",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="your-team@example.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Auth
    path('auth/register', views.RegisterView.as_view(), name='register'),
    path('auth/login', views.LoginView.as_view(), name='login'),
    path('auth/logout', views.LogoutView.as_view(), name='logout'),
    path('auth/forgot-password', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('auth/reset-password', views.ResetPasswordView.as_view(), name='reset-password'),

    # Profile
    path('users/profile', views.ProfileView.as_view(), name='profile'),
    path('users/<int:user_id>', views.PublicProfileView.as_view(), name='public-profile'),

    # Follow System
    path('users/<int:user_id>/follow', views.FollowToggleView.as_view(), name='follow-toggle'),
    path('users/<int:user_id>/followers', views.FollowersListView.as_view(), name='followers'),
    path('users/<int:user_id>/following', views.FollowingListView.as_view(), name='following'),
    path('users/feed/following', views.FollowingFeedView.as_view(), name='following-feed'),

    # Wallet System
    path('wallet', views.WalletView.as_view(), name='wallet'),
    path('wallet/transactions', views.WalletTransactionsView.as_view(), name='wallet-transactions'),
    path('admin/wallet/add/<int:user_id>', views.AdminAddCoinsView.as_view(), name='admin-add-coins'),

    # Password Reset System
    path('admin/password-reset-requests', views.AdminPasswordResetListView.as_view(), name='admin-reset-list'),
    path('admin/password-reset-requests/<int:id>/process', views.ProcessPasswordResetView.as_view(), name='process-reset'),
    # Swagger documentation endpoints (NEW)
    path('swagger<format>/', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    path('wallet/buy-coins/', views.BuyCoinsView.as_view(), name='buy-coins'),
]