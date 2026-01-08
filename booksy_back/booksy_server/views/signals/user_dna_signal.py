from django.db.models.signals import post_save
from django.dispatch import receiver
from ..models import User, UserProfile
from ..services.dna_service import update_user_literary_dna

@receiver(post_save, sender=User)
def handle_new_user_dna(sender, instance, created, **kwargs):
    if created:
        # 1. Creăm profilul utilizatorului
        # Folosim get_or_create pentru a evita erori dacă profilul a fost creat deja manual în altă parte
        profile, _ = UserProfile.objects.get_or_create(user=instance)
        
        # 2. Inițializăm ADN-ul literar
        # La acest punct va fi un profil de bază (fără quiz făcut încă)
        update_user_literary_dna(profile)