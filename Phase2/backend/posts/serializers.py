from rest_framework import serializers
from .models import Post, Like, Comment

class AuthorSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    username = serializers.CharField()
    profile_picture = serializers.CharField(allow_null=True, allow_blank=True)
    role = serializers.CharField()

class PostSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    like_count = serializers.SerializerMethodField()
    comment_count = serializers.SerializerMethodField()
    is_liked_by_user = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'notebook_id', 'author_id', 'author', 'content', 'image', 
                  'created_at', 'like_count', 'comment_count', 'is_liked_by_user']
    
    def get_author(self, obj):
        # This will be filled by the view with user data from Person A's API
        return getattr(obj, '_author', None)
    
    def get_like_count(self, obj):
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM likes WHERE post_id = %s", [obj.id])
            return cursor.fetchone()[0]
    
    def get_comment_count(self, obj):
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM comments WHERE post_id = %s", [obj.id])
            return cursor.fetchone()[0]
    
    def get_is_liked_by_user(self, obj):
        request = self.context.get('request')
        if request and request.user and request.user.is_authenticated:
            from django.db import connection
            with connection.cursor() as cursor:
                cursor.execute(
                    "SELECT COUNT(*) FROM likes WHERE user_id = %s AND post_id = %s",
                    [request.user.id, obj.id]
                )
                return cursor.fetchone()[0] > 0
        return False

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['content', 'image', 'notebook_id']
    
    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Content cannot be empty")
        return value

class LikeSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    
    class Meta:
        model = Like
        fields = ['user_id', 'username', 'created_at']
    
    def get_username(self, obj):
        return getattr(obj, '_username', None)

class CommentSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    
    class Meta:
        model = Comment
        fields = ['id', 'user_id', 'author', 'post_id', 'content', 'created_at']
    
    def get_author(self, obj):
        return getattr(obj, '_author', None)

class CommentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['content']
    
    def validate_content(self, value):
        if not value or not value.strip():
            raise serializers.ValidationError("Comment cannot be empty")
        return value