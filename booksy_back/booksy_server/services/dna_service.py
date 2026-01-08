from ..models import LiteraryDNA, Genre, RentalHistory

def update_user_literary_dna(user_profile):
    """
    Calculează și actualizează scorurile genetice literare pentru un profil.
    """
    dna_scores = {}

    # 1. Analiză Quiz (Scor bazat pe rezultatul salvat în profil)
    if user_profile.quiz_result_genre:
        genre_id = user_profile.quiz_result_genre.id
        dna_scores[genre_id] = dna_scores.get(genre_id, 0) + 10

    # 2. Analiză Favorite (Genurile alese manual de user)
    for genre in user_profile.favorite_genres.all():
        dna_scores[genre.id] = dna_scores.get(genre.id, 0) + 5

    # 3. Analiză Istoric (Cărțile închiriate efectiv)
    history = RentalHistory.objects.filter(user_profile=user_profile).select_related('book')
    for entry in history:
        try:
            genre_obj = Genre.objects.get(name=entry.book.genre)
            dna_scores[genre_obj.id] = dna_scores.get(genre_obj.id, 0) + 2
        except (Genre.DoesNotExist, AttributeError):
            continue

    # Salvare în baza de date 
    for genre_id, score in dna_scores.items():
        LiteraryDNA.objects.update_or_create(
            user_profile=user_profile,
            genre_id=genre_id,
            defaults={'score': score}
        )