from rest_framework import serializers, viewsets, filters
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