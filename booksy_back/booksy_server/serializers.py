from rest_framework import serializers
from .models.user import User
from .models.book_request import BookRequest
from django.contrib.auth.password_validation import validate_password
from .models.book import Book

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
    # requester va fi setat automat din request.user, deci doar read-only
    requester = serializers.StringRelatedField(read_only=True)

    # câmpul book trebuie să fie writeable pentru POST
    book = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        write_only=True
    )

    # câmp suplimentar pentru afișare frumoasă la GET
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = BookRequest
        fields = [
            'id',
            'requester',
            'book',        # folosit la POST (book_id)
            'book_title',  # afișat la GET
            'start_date',
            'end_date',
            'status',
            'message',
            'created_at'
        ]
        read_only_fields = ['id', 'requester', 'created_at', 'status']

    def validate(self, attrs):
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and end < start:
            raise serializers.ValidationError({'end_date': 'end_date must be >= start_date'})
        return attrs
