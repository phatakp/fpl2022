from django.conf import settings
from django.db import models
from django.utils import timezone

from .managers import PredictionManager


# Create your models here.
class Prediction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE)
    match = models.ForeignKey('apimatches.Match',
                              on_delete=models.CASCADE,
                              null=True)
    team = models.ForeignKey('apiteams.Team',
                             on_delete=models.CASCADE,
                             null=True)
    amount = models.PositiveSmallIntegerField()
    updated = models.DateTimeField(default=timezone.localtime)
    ipl_winner = models.BooleanField(default=False)
    double = models.BooleanField(default=False)
    status = models.CharField(max_length=20,
                              choices=settings.PREDICTION_STATUS_TYPES,
                              default=settings.PREDICTION_STATUS_TYPES[0][0])
    result = models.FloatField(default=0)

    objects = PredictionManager()

    def __str__(self) -> str:
        return f"{self.user}:{self.match}"

    class Meta:
        unique_together = ('user', 'match', 'team')
