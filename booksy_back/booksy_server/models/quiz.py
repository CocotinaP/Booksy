from django.db import models
from .book import Genre, Book


class QuizQuestion(models.Model):
    text = models.CharField(max_length=255)

    def __str__(self):
        return self.text


class QuizAnswerOption(models.Model):
    question = models.ForeignKey(QuizQuestion, on_delete=models.CASCADE, related_name='options')
    text = models.CharField(max_length=255)

    # genul spre care “împinge” răspunsul
    genre = models.ForeignKey(Genre, on_delete=models.SET_NULL, null=True, blank=True)

    weight = models.IntegerField(default=1)  # cât de puternic influențează

    def __str__(self):
        return f"{self.question.text} -> {self.text}"
