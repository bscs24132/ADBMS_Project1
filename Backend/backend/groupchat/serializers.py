from rest_framework import serializers
from .models import GroupChat, Member, Message

class GroupChatSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    writer_username = serializers.CharField(source='writer.username', read_only=True)

    class Meta:
        model = GroupChat
        fields = ['id', 'name', 'created_by_id', 'created_by_username',
                  'writer_id', 'writer_username', 'created_at']
        read_only_fields = ['id', 'created_at', 'created_by_id']

class MemberSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Member
        fields = ['user_id', 'username', 'group_id', 'role', 'joined_at']

class MessageSerializer(serializers.ModelSerializer):
    sender_username = serializers.CharField(source='sender.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'group_id', 'sender_id', 'sender_username', 'content', 'sent_at']