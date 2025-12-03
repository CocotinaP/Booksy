from rest_framework import serializers, viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models import Book
from django_filters.rest_framework import DjangoFilterBackend

class BookSerializer(serializers.ModelSerializer):
    # suprascriem câmpul photo ca să returneze URL-ul complet
    photo = serializers.ImageField(use_url=True)
    class Meta:
        model = Book
        fields = '__all__'   # include toate câmpurile din model

class BookViewSet(viewsets.ModelViewSet):
    """
    ViewSet pentru modelul Book.
    Oferă CRUD complet (list, retrieve, create, update, delete)
    + filtrare, căutare și sortare.
    """
    queryset = Book.objects.all()
    serializer_class = BookSerializer

    # backends pentru filtrare, căutare și sortare
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]

    # câmpuri pe care se poate filtra exact
    filterset_fields = ['author', 'genre', 'available', 'owner']

    # câmpuri pe care se poate căuta text (LIKE)
    search_fields = ['title', 'description']

    # câmpuri pe care se poate ordona
    ordering_fields = ['price_per_day', 'title', 'author']
    ordering = ['title']  # ordonare implicită

    @action(detail=False, methods=['get'])
    def surprise(self, request):
        """
        Returnează o carte aleatorie dintr-un gen specificat.
        Utilizare: /books/surprise/?genre=SF
        """

        genre_param = request.query_params.get('genre')

        if not genre_param:
            return Response(
                {"error": "Please specify a genre (ex: ?genre=Fiction)"},
                status=status.HTTP_400_BAD_REQUEST
            )

        books = Book.objects.filter(
            genre__icontains=genre_param, 
            available=True
        )

        if request.user.is_authenticated:
            books = books.exclude(owner=request.user)

        if not books.exists():
            return Response(
                {"message": f"I couldn't find any books available in the genre '{genre_param}'."},
                status=status.HTTP_404_NOT_FOUND
            )

    
        random_book = books.order_by('?').first()

        serializer = self.get_serializer(random_book)
        return Response(serializer.data)