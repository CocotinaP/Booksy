from django.apps import AppConfig


class BooksyServerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'booksy_server'

    def ready(self):
        # importă semnalele când pornește aplicația
        from . import signals
