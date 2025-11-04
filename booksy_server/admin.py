from django.contrib import admin
from .models import User, Book, BookRequest, Feedback, Message, Notification

admin.site.register(User)
admin.site.register(Book)
admin.site.register(BookRequest)
admin.site.register(Feedback)
admin.site.register(Message)
admin.site.register(Notification)