def increment_user_stat(user, stat_name, amount=1):
    """
    Crește o anumită statistică a utilizatorului.
    Exemple:
      increment_user_stat(user, "books_published")
      increment_user_stat(user, "messages_sent", 3)
    """
    stats = user.stats  # thanks to OneToOneField

    current_value = getattr(stats, stat_name)
    setattr(stats, stat_name, current_value + amount)
    stats.save()

    return getattr(stats, stat_name)
