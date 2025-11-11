from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class HeaderPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = 'pageSize'
    max_page_size = 100

    def get_paginated_response(self, data):
        # răspunsul JSON va fi doar lista
        response = Response(data)
        # adăugăm numărul total în header
        response['X-Total-Count'] = self.page.paginator.count
        return response
