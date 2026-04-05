from rest_framework import serializers
from .models import User, Wallet, PasswordResetRequest


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'bio', 'profile_picture', 'role', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=15)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    profile_picture = serializers.CharField(required=False, allow_blank=True)
    role = serializers.ChoiceField(choices=['user', 'writer', 'admin'], default='user')

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken.")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already registered.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            bio=validated_data.get('bio', ''),
            profile_picture=validated_data.get('profile_picture', ''),
            role=validated_data.get('role', 'user')
        )
        return user


class WalletSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Wallet
        fields = ['user_id', 'username', 'coin_balance', 'updated_at']


class TransactionSerializer(serializers.Serializer):
    book_id = serializers.IntegerField()
    book_title = serializers.CharField()
    cover_image = serializers.CharField()
    coins_spent = serializers.IntegerField()
    purchased_at = serializers.DateTimeField()
    author_name = serializers.CharField()


class PasswordResetRequestSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = PasswordResetRequest
        fields = ['id', 'user', 'username', 'email', 'requested_at', 'status']
        read_only_fields = ['requested_at', 'status']