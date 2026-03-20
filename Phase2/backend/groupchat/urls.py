from django.urls import path
from .views import (
    CreateGroupView, WriterGroupsView, AllGroupsView, GroupDetailView,
    MyGroupsView, JoinGroupView, RemoveMemberView, SendMessageView,
    GroupMessagesView, DeleteMessageView
)

urlpatterns = [
    path('', AllGroupsView.as_view(), name='groupchat-list'),
    path('create/', CreateGroupView.as_view(), name='create-group'),
    path('my/', MyGroupsView.as_view(), name='my-groups'),
    path('<int:group_id>/', GroupDetailView.as_view(), name='groupchat-detail'),
    path('<int:group_id>/join/', JoinGroupView.as_view(), name='join-group'),
    path('<int:group_id>/remove/<int:user_id>/', RemoveMemberView.as_view(), name='remove-member'),
    path('<int:group_id>/send/', SendMessageView.as_view(), name='send-message'),
    path('<int:group_id>/messages/', GroupMessagesView.as_view(), name='group-messages'),
    path('messages/<int:message_id>/delete/', DeleteMessageView.as_view(), name='delete-message'),
    path('writers/<int:writer_id>/', WriterGroupsView.as_view(), name='writer-groupchats'),
]