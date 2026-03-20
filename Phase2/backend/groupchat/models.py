from django.db import models
from django.conf import settings

class GroupChat(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='created_by',
        related_name='created_groups'
    )
    writer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        db_column='writer_id',
        related_name='writer_groups'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'groupchats'
        managed = False

class Member(models.Model):
    ROLE_CHOICES = [('admin', 'Admin'), ('member', 'Member')]
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='user_id'
    )
    group = models.ForeignKey(
        GroupChat,
        on_delete=models.CASCADE,
        db_column='group_id'
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'members'
        managed = False
        unique_together = ('user', 'group')

class Message(models.Model):
    id = models.AutoField(primary_key=True)
    group = models.ForeignKey(
        GroupChat,
        on_delete=models.CASCADE,
        db_column='group_id'
    )
    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='sender_id'
    )
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'messages'
        managed = False