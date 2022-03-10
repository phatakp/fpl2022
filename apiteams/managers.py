from django.db import models
from django.db.models.signals import post_save, pre_save


class TeamManager(models.Manager):
    def get_object_or_none(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except:
            return

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            pre_save.send(item.__class__, instance=item)
        a = super().bulk_create(objs, **kwargs)
        for item in objs:
            post_save.send(item.__class__, instance=item, created=True)
        return a


class StandingsManager(models.Manager):
    def get_object_or_none(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except:
            return

    def get_queryset(self):
        return super().get_queryset().select_related('team')

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            pre_save.send(item.__class__, instance=item)
        return super().bulk_create(objs, **kwargs)
