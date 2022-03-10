from django.db import models
from django.db.models.signals import pre_save


class PredictionManager(models.Manager):
    def get_object_or_none(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except:
            return

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            pre_save.send(item.__class__, instance=item)
        return super().bulk_create(objs, **kwargs)

    def get_queryset(self):
        return super().get_queryset().select_related('user', 'match__team1', 'match__team2', 'match__bat_first', 'team').order_by('-match__num')
