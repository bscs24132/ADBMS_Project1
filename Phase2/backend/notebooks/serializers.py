from rest_framework import serializers
from .models import Notebook

class NotebookSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Notebook
        fields = ['id', 'title', 'description', 'author_id', 'author_username', 'is_approved', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_approved', 'author_id']