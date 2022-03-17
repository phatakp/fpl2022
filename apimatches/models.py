from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone

from .managers import *
from .validators import *


# Create your models here.
class Match(models.Model):
    num = models.PositiveSmallIntegerField(primary_key=True)
    date = models.DateTimeField()
    team1 = models.ForeignKey("apiteams.Team",
                              on_delete=models.CASCADE,
                              related_name="home")
    team2 = models.ForeignKey("apiteams.Team",
                              on_delete=models.CASCADE,
                              related_name="away")
    bat_first = models.ForeignKey("apiteams.Team",
                                  on_delete=models.CASCADE,
                                  related_name="batFirst",
                                  blank=True, null=True)
    slug = models.SlugField(max_length=100, unique=True, null=True)
    venue = models.CharField(max_length=200)
    type = models.CharField(max_length=20,
                            choices=settings.MATCH_TYPES,
                            default=settings.MATCH_TYPES[0][0])
    min_bet = models.PositiveSmallIntegerField(default=30)
    team1_score = models.CharField(max_length=10,
                                   validators=[score_validator, ],
                                   blank=True, null=True)
    team2_score = models.CharField(max_length=10,
                                   validators=[score_validator, ],
                                   blank=True, null=True)
    team1_overs = models.FloatField(blank=True, null=True)
    team2_overs = models.FloatField(blank=True, null=True)
    double = models.BooleanField(default=False)

    objects = MatchManager()

    def __str__(self) -> str:
        return self.slug

    class Meta:
        ordering = ('num',)
        verbose_name_plural = 'Matches'

    @property
    def entry_cutoff_passed(self):
        return timezone.localtime() >= self.date - timedelta(minutes=60)

    @property
    def double_cutoff_passed(self):
        return timezone.localtime() >= self.date + timedelta(minutes=60)

    @property
    def is_started(self):
        return timezone.localtime() >= self.date

    @property
    def teams(self):
        return (self.team1, self.team2)


class MatchResult(models.Model):
    match = models.OneToOneField(Match, on_delete=models.CASCADE)
    status = models.CharField(max_length=20,
                              choices=settings.MATCH_STATUS,
                              default=settings.MATCH_STATUS[0][0])
    winner = models.ForeignKey("apiteams.Team",
                               on_delete=models.CASCADE,
                               blank=True, null=True)
    win_type = models.CharField(max_length=10,
                                choices=settings.WIN_TYPES,
                                blank=True, null=True)
    win_margin = models.PositiveIntegerField(blank=True, null=True)

    objects = MatchResultManager()

    def __str__(self) -> str:
        return str(self.match)

    class Meta:
        ordering = ('match',)

    @property
    def is_scheduled(self):
        return self.status == 'scheduled'

    @property
    def is_completed(self):
        return self.status == 'completed'

    @property
    def is_abandoned(self):
        return self.status == 'abandoned'
