from django.db import models, connection
from django.contrib.auth.hashers import make_password, check_password
from django.utils import timezone


class UserManager(models.Manager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        user = self.model(
            username=username,
            email=email,
            bio=extra_fields.get('bio', ''),
            profile_picture=extra_fields.get('profile_picture', ''),
            role=extra_fields.get('role', 'user'),
            date_joined=timezone.now()
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')
        return self.create_user(username=username, password=password, **extra_fields)

    def get(self, **kwargs):
        try:
            conditions = []
            params = []

            for key, value in kwargs.items():
                if key == 'username':
                    conditions.append("username = %s")
                    params.append(value)
                elif key == 'id':
                    conditions.append("id = %s")
                    params.append(value)
                elif key == 'email':
                    conditions.append("email = %s")
                    params.append(value)

            if not conditions:
                raise self.model.DoesNotExist

            query = f"SELECT id, username, password, bio, email, profile_picture, date_joined, role FROM users WHERE {' AND '.join(conditions)} LIMIT 1"

            with connection.cursor() as cursor:
                cursor.execute(query, params)
                row = cursor.fetchone()

            if not row:
                raise self.model.DoesNotExist

            # Columns: 0=id, 1=username, 2=password, 3=bio, 4=email, 5=profile_picture, 6=date_joined, 7=role
            user = self.model(
                id=row[0],
                username=row[1],
                password=row[2],
                bio=row[3],
                email=row[4],
                profile_picture=row[5],
                date_joined=row[6] or timezone.now(),
                role=row[7]
            )

            return user

        except Exception as e:
            raise self.model.DoesNotExist from e


class User(models.Model):
    ROLE_CHOICES = (
        ('user', 'User'),
        ('writer', 'Writer'),
        ('admin', 'Admin'),
    )

    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=15, unique=True)
    email = models.CharField(max_length=255, unique=True, null=True)
    password = models.CharField(max_length=255)
    bio = models.TextField(blank=True, null=True)
    profile_picture = models.CharField(max_length=255, blank=True, null=True)
    date_joined = models.DateTimeField(default=timezone.now)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')

    objects = UserManager()

    @property
    def is_active(self):
        return True

    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_staff(self):
        return self.role == 'admin'

    @property
    def is_superuser(self):
        return self.role == 'admin'

    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'username'

    class Meta:
        db_table = 'users'
        managed = False

    def __str__(self):
        return self.username

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def has_perm(self, perm, obj=None):
        return self.role == 'admin'

    def has_module_perms(self, app_label):
        return self.role == 'admin'


class Follow(models.Model):
    follower = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='following_set',
        db_column='follower_id'
    )
    following = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='follower_set',
        db_column='following_id'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'follows'
        managed = False
        unique_together = (('follower', 'following'),)

    def __str__(self):
        return f"{self.follower.username} follows {self.following.username}"


class Wallet(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        primary_key=True,
        db_column='user_id'
    )
    coin_balance = models.IntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'wallets'
        managed = False

    def __str__(self):
        return f"{self.user.username}: {self.coin_balance} coins"


class PasswordResetRequest(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processed', 'Processed'),
        ('cancelled', 'Cancelled'),
    )

    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_id')
    email = models.CharField(max_length=255)
    requested_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    class Meta:
        db_table = 'password_reset_requests'
        managed = False

    def __str__(self):
        return f"Reset request for {self.user.username} ({self.status})"
    
class UserBookAccess(models.Model):
    user_id = models.IntegerField()
    book_id = models.IntegerField()
    granted_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_book_access'
        managed = False
        unique_together = (('user_id', 'book_id'),)