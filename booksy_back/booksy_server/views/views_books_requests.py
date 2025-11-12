from rest_framework import viewsets, permissions, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models.book_request import BookRequest
from ..serializers import BookRequestSerializer

class BookRequestViewSet(viewsets.ModelViewSet):
    queryset = BookRequest.objects.all()
    serializer_class = BookRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # extragem ID-ul cărții din request
        book_id = self.request.data.get("book")
        if not book_id:
            raise serializers.ValidationError({"book": "ID-ul cărții este obligatoriu."})

        # salvăm cererea: requester este utilizatorul curent
        serializer.save(requester=self.request.user, book_id=book_id)

    @action(detail=False, methods=['get'], url_path='sent')
    def sent(self, request):
        """Cererile trimise de utilizatorul curent."""
        qs = BookRequest.objects.filter(requester=request.user)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='received')
    def received(self, request):
        requests = BookRequest.objects.filter(book__owner=request.user)
        serializer = self.get_serializer(requests, many=True)
        data = serializer.data
        if not data:
            return Response({"message": "No received books requests found.", "results": []})
        return Response(data)

    @action(detail=True, methods=['put'], url_path='accept')
    def accept(self, request, pk=None):
        book_request = self.get_object()
        if book_request.book.owner != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        book_request.status = 'accepted'
        book_request.save()
        return Response({'status': 'accepted'})

    @action(detail=True, methods=['put'], url_path='reject')
    def reject(self, request, pk=None):
        book_request = self.get_object()
        if book_request.book.owner != request.user:
            return Response({'error': 'Not authorized'}, status=403)
        book_request.status = 'rejected'
        book_request.save()
        return Response({'status': 'rejected'})