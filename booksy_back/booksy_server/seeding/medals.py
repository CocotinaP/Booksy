# booksy_server/seed_medals.py
from django.db import transaction
from ..models import Medal


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


@transaction.atomic
def seed_medals():
    """
    Creează / actualizează medaliile definite în MEDALS.
    - nu creează duplicate (folosește name ca identificator unic)
    - dacă modifici description/threshold/etc, se face update
    """
    for data in MEDALS:
        Medal.objects.update_or_create(
            name=data["name"],             # cheie unică logică
            defaults={
                "description": data["description"],
                "action_type": data["action_type"],
                "threshold": data["threshold"],
                "is_repeatable": data.get("is_repeatable", False),
                # dacă ai icon: "icon": ...
            },
        )
