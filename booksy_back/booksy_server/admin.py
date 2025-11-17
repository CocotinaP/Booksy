from django.contrib import admin
from .models import User, Book, BookRequest, Feedback, Message, Notification, BookAnnouncement, BookAnnouncementResponse

admin.site.register(User)
admin.site.register(Book)
admin.site.register(BookRequest)
admin.site.register(Feedback)
admin.site.register(Message)
admin.site.register(Notification)
admin.site.register(BookAnnouncement)
admin.site.register(BookAnnouncementResponse)