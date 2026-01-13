from .models.quiz import QuizAnswerOption, QuizQuestion
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from .models.book_announcement_response import BookAnnouncementResponse
from .models.user import User
from .models.book_request import BookRequest
from .models.book_announcement import BookAnnouncement
from .models.book import Book
from .models import Notification
from .models import Medal, UserMedal
from .models import UserProfile, Genre, Author, RentalHistory
from .models.user import LiteraryDNA, UserProfile

class RegisterSerializer(serializers.ModelSerializer):
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


# ... păstrează importurile tale de sus ...

# 1. ACTUALIZARE: BookRequestSerializer
class BookRequestSerializer(serializers.ModelSerializer):
    requester = serializers.StringRelatedField(read_only=True)

    # Câmp nou: Afișăm telefonul când citim cererea
    requester_phone = serializers.CharField(source='requester.phone_number', read_only=True)

    # Câmp nou: Permitem introducerea telefonului la creare (nu se salvează în BookRequest, ci în User)
    phone_number = serializers.CharField(write_only=True, required=False)

    book = serializers.PrimaryKeyRelatedField(
        queryset=Book.objects.all(),
        write_only=True
    )
    book_title = serializers.CharField(source='book.title', read_only=True)

    class Meta:
        model = BookRequest
        fields = [
            'id',
            'requester',
            'requester_phone',  # Adăugat la output
            'phone_number',  # Adăugat la input
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
        start = attrs.get('start_date')
        end = attrs.get('end_date')
        if start and end and end < start:
            raise serializers.ValidationError({'end_date': 'end_date must be >= start_date'})

        # --- VALIDARE TELEFON ---
        request = self.context.get('request')
        phone_input = attrs.get('phone_number')

        # Verificăm dacă userul are deja telefon SAU dacă l-a trimis acum
        if request and not request.user.phone_number and not phone_input:
            raise serializers.ValidationError({
                "phone_number": "Nu aveți un număr de telefon setat. Vă rugăm să îl completați pentru a face o cerere."
            })

        return attrs

    def create(self, validated_data):
        # Scoatem numărul de telefon din date (nu există pe modelul BookRequest)
        phone_input = validated_data.pop('phone_number', None)
        request = self.context.get('request')

        # Dacă a fost furnizat un număr nou, actualizăm User-ul
        if phone_input and request:
            user = request.user
            user.phone_number = phone_input
            user.save()

        # Setăm requester-ul automat
        validated_data['requester'] = request.user
        return super().create(validated_data)


# 2. ACTUALIZARE: BookAnnouncementResponseSerializer
class BookAnnouncementResponseSerializer(serializers.ModelSerializer):
    responder = serializers.PrimaryKeyRelatedField(read_only=True)
    # Afișăm telefonul celui care răspunde
    responder_phone = serializers.CharField(source='responder.phone_number', read_only=True)
    # Permitem introducerea telefonului
    phone_number = serializers.CharField(write_only=True, required=False)

    announcement = serializers.PrimaryKeyRelatedField(queryset=BookAnnouncement.objects.all())

    class Meta:
        model = BookAnnouncementResponse
        fields = [
            'id',
            'announcement',
            'responder',
            'responder_phone',  # Output
            'phone_number',  # Input
            'image',
            'message',
            'status',
            'created_at'
        ]
        read_only_fields = ('id', 'responder', 'status', 'created_at')

    def validate_announcement(self, value):
        request = self.context.get('request')
        if request and value.publisher == request.user:
            raise serializers.ValidationError("You cannot respond to your own announcement.")
        return value

    def validate(self, attrs):
        request = self.context.get('request')

        # --- VALIDARE TELEFON ---
        phone_input = attrs.get('phone_number')
        if request and not request.user.phone_number and not phone_input:
            raise serializers.ValidationError({
                "phone_number": "Este necesar un număr de telefon pentru a răspunde la anunț."
            })

        # Validare duplicat
        announcement = attrs.get('announcement')
        if request and announcement:
            exists = BookAnnouncementResponse.objects.filter(
                announcement=announcement,
                responder=request.user
            ).exists()
            if exists:
                raise serializers.ValidationError("You have already submitted a response to this announcement.")
        return attrs

    def create(self, validated_data):
        # Actualizare telefon user
        phone_input = validated_data.pop('phone_number', None)
        request = self.context.get('request')

        if phone_input and request:
            user = request.user
            user.phone_number = phone_input
            user.save()

        validated_data['responder'] = request.user
        return super().create(validated_data)


class BookAnnouncementSerializer(serializers.ModelSerializer):
    publisher = serializers.StringRelatedField(read_only=True)
    
    publisher_full_name = serializers.ReadOnlyField(source='publisher.__str__')

    # Afișăm telefonul publisher-ului în anunț
    publisher_phone = serializers.CharField(source='publisher.phone_number', read_only=True)
    # Permitem introducerea lui la creare
    phone_number = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = BookAnnouncement
        fields = [
            'id',
            'publisher',
            'publisher_full_name',
            'publisher_phone',  # Output important!
            'phone_number',  # Input
            'title',
            'author',
            'description',
            'created_at'
        ]
        read_only_fields = ['id', 'publisher', 'created_at']

    def validate(self, attrs):
        request = self.context.get('request')
        phone_input = attrs.get('phone_number')


        if request and not request.user.phone_number and not phone_input:
            raise serializers.ValidationError({
                "phone_number": "Trebuie să aveți un număr de telefon pentru a publica un anunț."
            })
        return attrs

    def create(self, validated_data):
        phone_input = validated_data.pop('phone_number', None)
        request = self.context.get('request')

        if phone_input and request:
            user = request.user
            user.phone_number = phone_input
            user.save()

        validated_data['publisher'] = request.user
        return super().create(validated_data)
    
class NotificationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  

    class Meta:
        model = Notification
        fields = [
            "id",
            "user",
            "type",
            "message",
            "created_at",
            "is_read",
        ]
        read_only_fields = ["id", "created_at", "user"]


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'name']


class RentalHistorySerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)

    book_photo = serializers.ImageField(source='book.photo', read_only=True)

    class Meta:
        model = RentalHistory
        fields = ['id', 'book_title', 'book_author', 'book_photo', 'rented_at', 'returned_at']

class BookSerializer(serializers.ModelSerializer):
    """
    Serializer for book objects.
    """
    owner_name = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model = Book
        fields = [
            'id',
            'title',
            'author',
            'genre',
            'description',
            'price_per_day',
            'photo',
            'available',
            'owner_name'
        ]

class UserProfileSerializer(serializers.ModelSerializer):
    favorite_genres = GenreSerializer(many=True, read_only=True)
    favorite_authors = AuthorSerializer(many=True, read_only=True)

    genre_ids = serializers.PrimaryKeyRelatedField(
        queryset=Genre.objects.all(),
        source='favorite_genres',
        write_only=True,
        many=True
    )
    author_ids = serializers.PrimaryKeyRelatedField(
        queryset=Author.objects.all(),
        source='favorite_authors',
        write_only=True,
        many=True
    )

    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    quiz_result_genre = GenreSerializer(read_only=True)
    quiz_recommended_book = BookSerializer(read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'id',
            'username', 'first_name', 'last_name',  # Date din User
            'favorite_genres', 'favorite_authors',  # Date detaliate (Read)
            'genre_ids', 'author_ids',  # Date pentru update (Write)
            'quiz_result_genre', 'quiz_recommended_book'
        ]

class MedalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medal
        fields = ["id", "name", "description", "action_type", "threshold", "icon"]

class UserMedalSerializer(serializers.ModelSerializer):
    medal = MedalSerializer(read_only=True)
    progress_percent = serializers.FloatField(read_only=True)

    class Meta:
        model = UserMedal
        fields = [
            "id",
            "medal",
            "progress",
            "progress_percent",
            "is_unlocked",
            "unlocked_at",
        ]

class QuizAnswerOptionSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = QuizAnswerOption 
        fields = ['id', 'text'] 
        
class QuizQuestionSerializer(serializers.ModelSerializer): 
    options = QuizAnswerOptionSerializer(many=True) 
    class Meta: 
        model = QuizQuestion 
        fields = ['id', 'text', 'options'] 
    
class QuizSubmitSerializer(serializers.Serializer): 
    # listă de {question_id, option_id} 
    answers = serializers.ListField( child=serializers.DictField() ) 
    
class RecommendedBookSerializer(serializers.ModelSerializer): 
    class Meta: 
        model = Book 
        fields = ['id', 'title', 'author', 'genre', 'description']

class LiteraryDNASerializer(serializers.ModelSerializer):
    genre_name = serializers.ReadOnlyField(source='genre.name')

    class Meta:
        model = LiteraryDNA
        fields = ['genre_name', 'score']

class LiteraryProfileSerializer(serializers.ModelSerializer):
    # Afișăm o listă de scoruri pentru fiecare gen
    dna = LiteraryDNASerializer(many=True, read_only=True)
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = UserProfile
        fields = ['username', 'dna']