from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from ..models.book_request import BookRequest
from ..serializers import BookRequestSerializer

class BookRequestViewSet(viewsets.ModelViewSet):
    queryset = BookRequest.objects.all()
    serializer_class = BookRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='sent')
    def sent(self, request):
        requests = BookRequest.objects.filter(requester=request.user)
        serializer = self.get_serializer(requests, many=True)
        data = serializer.data
        if not data:
            return Response({"message": "No sent books requests found.", "results": []})
        return Response(data)

    @action(detail=False, methods=['get'], url_path='received')
    def received(self, request):
        requests = BookRequest.objects.filter(book__owner=request.user)
        serializer = self.get_serializer(requests, many=True)
        data = serializer.data
        if not data:
            return Response({"message": "No received books requests found.", "results": []})
        return Response(data)