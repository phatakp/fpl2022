from django.db.models.signals import pre_save
from django.dispatch import receiver

from .models import Match


@receiver(pre_save, sender=Match)
def create_slug(sender, instance, **kwargs):
    instance.slug = f"{instance.team1}vs{instance.team2}-{instance.date.date()}"
