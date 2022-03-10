from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import MatchHistory


@receiver(pre_save, sender=MatchHistory)
def create_slug(sender, instance, **kwargs):
    instance.slug = f"{instance.team1}vs{instance.team2}-{instance.date}"
