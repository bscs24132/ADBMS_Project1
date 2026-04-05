from django.db import models
from django.conf import settings

class Book(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        db_column='author_id'
    )
    coin_price = models.IntegerField(default=0)
    cover_image = models.CharField(max_length=255, blank=True, null=True)
    is_approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'books'
        managed = False

    def __str__(self):
        return self.title