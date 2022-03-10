from django.db import models
from django.db.models.signals import pre_save


class MatchHistoryManager(models.Manager):
    def get_object_or_none(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except:
            return

    def get_queryset(self):
        return super().get_queryset().select_related('team1', 'team2', 'winner', 'bat_first')

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            pre_save.send(item.__class__, instance=item)
        return super().bulk_create(objs, **kwargs)


class TeamStatsManager(models.Manager):
    def get_object_or_none(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except:
            return

    def get_queryset(self):
        return super().get_queryset().select_related('team1', 'team2')

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            pre_save.send(item.__class__, instance=item)
        return super().bulk_create(objs, **kwargs)
