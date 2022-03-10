from django.conf import settings
from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from .models import Standing, Team


@receiver(pre_save, sender=Team)
def create_long_name(sender, instance, **kwargs):
    instance.long_name = [
        y for x, y in settings.TEAM_CHOICES if x == instance.short_name][0]


@receiver(post_save, sender=Team)
def create_standing(sender, instance, created, **kwargs):
    if created and instance.active:
        Standing.objects.create(team=instance)
