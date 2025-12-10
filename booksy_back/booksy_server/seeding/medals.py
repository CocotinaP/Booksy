# booksy_server/seed_medals.py
from django.db import transaction
from ..models import Medal
from django.core.files import File
from django.conf import settings
from pathlib import Path



MEDALS = [
    {
        "name": "First Book Published",
        "description": "Publică prima ta carte.",
        "action_type": "books_published",
        "threshold": 1,
        "is_repeatable": False,
    },
    {
        "name": "Book Publisher",
        "description": "Publică 5 cărți.",
        "action_type": "books_published",
        "threshold": 5,
        "is_repeatable": False,
    },
    {
        "name": "Super Publisher",
        "description": "Publică 10 cărți.",
        "action_type": "books_published",
        "threshold": 10,
        "is_repeatable": False,
    },
    {
        "name": "First Rental",
        "description": "Închiriază prima carte.",
        "action_type": "books_rented",
        "threshold": 1,
        "is_repeatable": False,
    },
    {
    "name": "First Time Lending",
    "description": "Împrumută o carte pentru prima dată.",
    "action_type": "books_lent",
    "threshold": 1,
    },
    # mai adaugi ce vrei
]

MEDAL_ICON_FILES = {
    "First Book Published": "seed_images/badge1.png",
    "Book Publisher": "seed_images/badge2.png",
    "Super Publisher": "seed_images/badge3.png",
    "First Rental": "seed_images/badge4.png",
    "First Time Lending": "seed_images/badge1.png",
}

@transaction.atomic
def seed_medals():
    for data in MEDALS:
        # 1. Create/update medal WITHOUT icon first
        medal, _created = Medal.objects.update_or_create(
            name=data["name"],
            defaults={
                "description": data["description"],
                "action_type": data["action_type"],
                "threshold": data["threshold"],
                "is_repeatable": data.get("is_repeatable", False),
            },
        )

        # 2. Then handle icon separately
        rel_path = MEDAL_ICON_FILES.get(data["name"])
        if rel_path:
            file_path = Path(settings.BASE_DIR) / "booksy_server" / "seeding" /rel_path
            print(file_path)
            if file_path.exists():
                # open file and save directly to the ImageField
                with file_path.open("rb") as f:
                    medal.icon.save(file_path.name, File(f), save=True)

    print("Medals seeded.")