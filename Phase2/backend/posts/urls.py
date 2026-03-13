from django.urls import path
from . import views

urlpatterns = [
    path('posts/', views.PostListView.as_view(), name='post-list'),
    path('notebooks/<int:notebook_id>/posts', views.CreateNotebookPostView.as_view(), name='notebook-post-create'),
    path('posts/<int:post_id>/', views.PostDetailView.as_view(), name='post-detail'),
    path('users/<int:user_id>/posts/', views.UserPostsView.as_view(), name='user-posts'),
    path('posts/feed/following/', views.FollowingFeedView.as_view(), name='following-feed'),
    path('posts/<int:post_id>/like/', views.LikeToggleView.as_view(), name='post-like'),
    path('posts/<int:post_id>/likes/', views.PostLikesView.as_view(), name='post-likes'),
    path('posts/<int:post_id>/comments/', views.CommentCreateView.as_view(), name='comment-create'),
    path('posts/<int:post_id>/comments/list/', views.PostCommentsView.as_view(), name='post-comments'),
    path('comments/<int:comment_id>/', views.CommentUpdateView.as_view(), name='comment-update'),
    path('comments/<int:comment_id>/delete/', views.CommentDeleteView.as_view(), name='comment-delete'),
]