from django.db import models
from django.utils import timezone

class Post(models.Model):
    id = models.AutoField(primary_key=True)
    notebook_id = models.IntegerField(null=True, blank=True)
    author_id = models.IntegerField()  # Foreign key to users table
    content = models.TextField(null=True, blank=True)
    image = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'posts'
        managed = False
    
    def __str__(self):
        return f"Post {self.id} by user {self.author_id}"

class Like(models.Model):
    user_id = models.IntegerField()
    post_id = models.IntegerField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'likes'
        managed = False
        unique_together = (('user_id', 'post_id'),)
    
    def __str__(self):
        return f"User {self.user_id} likes post {self.post_id}"

class Comment(models.Model):
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    post_id = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        db_table = 'comments'
        managed = False
    
    def __str__(self):
        return f"Comment {self.id} by user {self.user_id}"