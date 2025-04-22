from django.contrib.auth.models import User
from rest_framework import serializers

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    email = serializers.EmailField(required=True)
    first_name = serializers.CharField(max_length=150, required=True)
    last_name = serializers.CharField(max_length=150, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name']

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def validate_username(self, value):
        if len(value) < 4:
            raise serializers.ValidationError("Username must be at least 4 characters long.")
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Username already exists.")        
        if not value.isalnum():
            raise serializers.ValidationError("Username can only contain letters and numbers.")        
        return value

    def validate_first_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("First name cannot be empty.")
        if not all(char.isalpha() or char.isspace() for char in value):
            raise serializers.ValidationError("First name can only contain letters.")
        return value.strip()

    def validate_last_name(self, value):
        if not value.strip():
            raise serializers.ValidationError("Last name cannot be empty.")
        if not all(char.isalpha() or char.isspace() for char in value):
            raise serializers.ValidationError("Last name can only contain letters.")
        return value.strip()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user