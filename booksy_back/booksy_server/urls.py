from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomTokenObtainPairView, HelloWorldView, BookViewSet, BookAnnouncementViewSet, NotificationViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views.views_logout import LogoutView
from .views.views_register import RegisterView
from .views.views_books_requests import BookRequestViewSet
from .views.views_book_announcement_response import BookAnnouncementResponseViewSet
from .views.views_profile import UserProfileView, UserHistoryView, OptionsView

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='books')
router.register(r'books-requests', BookRequestViewSet, basename='books-requests')
router.register(r'book-announcements', BookAnnouncementViewSet, basename='book-announcements')
router.register(r'book-announcements-responses', BookAnnouncementResponseViewSet, basename='book-announcements-responses')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', HelloWorldView.as_view(), name='hello_world'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout', LogoutView.as_view(), name="logout"),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/history/', UserHistoryView.as_view(), name='user-history'),
    path('options/', OptionsView.as_view(), name='options-list'),
    path('', include(router.urls)),   # aici se includ rutele generate de router
]