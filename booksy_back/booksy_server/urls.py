from django.urls import path, include
from .views.views_quiz import QuizQuestionsView, QuizSubmitView
from rest_framework.routers import DefaultRouter
from .views import CustomTokenObtainPairView, HelloWorldView, BookViewSet, BookAnnouncementViewSet, NotificationViewSet
from rest_framework_simplejwt.views import TokenRefreshView
from .views.views_logout import LogoutView
from .views.views_recommendations import RecommendationView
from .views.views_register import RegisterView
from .views.views_feedback import FeedbackViewSet
from .views.views_books_requests import BookRequestViewSet
from .views.views_book_announcement_response import BookAnnouncementResponseViewSet
from .views.views_profile import UserProfileView, UserHistoryView, OptionsView
from .views.views_user_medal import UserMedalViewSet


from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Booksy API",
        default_version='v1',
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

router = DefaultRouter()
router.register(r'books', BookViewSet, basename='books')
router.register(r'books-requests', BookRequestViewSet, basename='books-requests')
router.register(r'book-announcements', BookAnnouncementViewSet, basename='book-announcements')
router.register(r'book-announcements-responses', BookAnnouncementResponseViewSet, basename='book-announcements-responses')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'feedback', FeedbackViewSet, basename='feedback')
router.register(r'user-medals', UserMedalViewSet, basename='user-medals')


urlpatterns = [
    path('', HelloWorldView.as_view(), name='hello_world'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout', LogoutView.as_view(), name="logout"),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('profile/history/', UserHistoryView.as_view(), name='user-history'),
    path('options/', OptionsView.as_view(), name='options-list'),
    path('recommendations/', RecommendationView.as_view(), name='book-recommendations'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='swagger-ui'),
    path('', include(router.urls)),   # aici se includ rutele generate de router
    path('quiz/questions/', QuizQuestionsView.as_view(), name='quiz-questions'), 
    path('quiz/submit/', QuizSubmitView.as_view(), name='quiz-submit'),
]