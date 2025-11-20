from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models.book_announcement_response import BookAnnouncementResponse
from .models.user import User
from .models.book_request import BookRequest
from .models.book_announcement import BookAnnouncement
from .models.book import Book

class RegisterSerializer(serializers.ModelSerializer):
    # Password trebuie write-only astfel încât să nu fie returnat în răspunsul API.
    # Se folosește validatorul Django pentru parole (validate_password) pentru a aplica reguli
    # de complexitate/performance definite în settings.
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('first_name', 'last_name', 'username', 'password', 'email', 'phone_number', 'address')

    def validate(self, attrs):
        """
        Validări suplimentare la nivel de serializer
        """
        if User.objects.filter(username=attrs['username']).exists():
            raise serializers.ValidationError({"username": "Username already exists."})
        if User.objects.filter(email=attrs['email']).exists():
            raise serializers.ValidationError({"email": "Email already exists."})
        return attrs

    def create(self, validated_data):
        """
        Creează utilizatorul folosind metoda helper create_user definită pe modelul User
        Returnează instanța creată de User.
        """
        user = User.objects.create_user(**validated_data)
        return user


class BookRequestSerializer(serializers.ModelSerializer):
    # requester va fi setat de view (perform_create) din request.user, deci read-only aici.
    requester = serializers.StringRelatedField(read_only=True)

    # book este writeable pentru a permite trimiterea ID-ului cartei la POST.
    book = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        write_only=True
    )

    # câmp auxiliar read-only pentru a afișa titlul cărții în răspuns
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = BookRequest
        fields = [
            'id',
            'requester',
            'book',
            'book_title',
            'start_date',
            'end_date',
            'status',
            'message',
            'created_at'
        ]
        read_only_fields = ['id', 'requester', 'created_at', 'status']

    def validate(self, attrs):
        """
        Validare la nivel de serializer pentru a asigura că intervalul de date este valid
        """
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and end < start:
            raise serializers.ValidationError({'end_date': 'end_date must be >= start_date'})
        return attrs

class BookAnnouncementResponseSerializer(serializers.ModelSerializer):
    # Responder este read-only: este setat automat în view (perform_create) la request.user
    responder = serializers.PrimaryKeyRelatedField(read_only=True)
    # Announcement este writeable: clientul trimite ID-ul anunțului la crearea răspunsului
    announcement = serializers.PrimaryKeyRelatedField(queryset=BookAnnouncement.objects.all())

    class Meta:
        model = BookAnnouncementResponse
        fields = ['id', 'announcement', 'responder', 'image', 'message', 'status', 'created_at']
        read_only_fields = ('id', 'responder', 'status', 'created_at')

    def validate_announcement(self, value):
        """
        Previne trimiterea unui răspuns la propriul anunț.
        """
        request = self.context.get('request')
        if request and value.publisher == request.user:
            raise serializers.ValidationError("You cannot respond to your own announcement.")
        return value

    def validate(self, attrs):
        """
        Previne trimiterea unor răspunsuri duplicate de către același user pentru același anunț.
        """
        request = self.context.get('request')
        announcement = attrs.get('announcement')
        if request and announcement:
            exists = BookAnnouncementResponse.objects.filter(
                announcement=announcement,
                responder=request.user
            ).exists()
            if exists:
                raise serializers.ValidationError("You have already submitted a response to this announcement.")
        return attrs