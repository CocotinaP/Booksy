from django.contrib import admin
from .models import User, Book, BookRequest, Feedback, Message, Notification, BookAnnouncement, \
    BookAnnouncementResponse, UserProfile, Genre, Author, RentalHistory, Medal

admin.site.register(User)
admin.site.register(Book)
admin.site.register(BookRequest)
admin.site.register(Feedback)
admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(BookAnnouncement)
admin.site.register(BookAnnouncementResponse)
admin.site.register(UserProfile)
admin.site.register(Genre)
admin.site.register(Author)
admin.site.register(RentalHistory)
admin.site.register(Medal)