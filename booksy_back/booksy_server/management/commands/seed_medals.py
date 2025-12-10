# booksy_server/management/commands/seed_medals.py
from django.core.management.base import BaseCommand
from ...seeding.medals import seed_medals  # adjust path if needed


class Command(BaseCommand):
    help = "Seed medals (with icons)"

    def handle(self, *args, **options):
        seed_medals()
        self.stdout.write(self.style.SUCCESS("Medals seeded."))
