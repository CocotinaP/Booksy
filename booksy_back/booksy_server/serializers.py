from rest_framework import serializers
from .models.user import User
from .models.book_request import BookRequest
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'password', 'email', 'phone_number', 'address')

    def validate(self, attrs):
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    

class BookRequestSerializer(serializers.ModelSerializer):
    requester = serializers.StringRelatedField() 
    book = serializers.StringRelatedField()
    class Meta:
        model = BookRequest
        fields = '__all__'
