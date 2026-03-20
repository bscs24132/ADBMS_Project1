from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Book
        fields = ['id', 'title', 'description', 'content', 'author_id',
                  'author_username', 'coin_price', 'cover_image', 'is_approved', 'created_at']
        read_only_fields = ['id', 'created_at', 'is_approved', 'author_id']