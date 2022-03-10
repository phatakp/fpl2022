from django.conf import settings
from django.db import models

from .managers import *


# Create your models here.
class Team(models.Model):
    short_name = models.CharField(max_length=4,
                                  choices=settings.TEAM_CHOICES,
                                  primary_key=True)
    long_name = models.CharField(max_length=30,
                                 blank=True,
                                 null=True)
    active = models.BooleanField(default=True)
    objects = TeamManager()

    def __str__(self) -> str:
        return self.short_name

    class Meta:
        ordering = ('short_name',)


class Standing(models.Model):
    team = models.OneToOneField(Team, on_delete=models.CASCADE)
    played = models.PositiveSmallIntegerField(default=0)
    won = models.PositiveSmallIntegerField(default=0)
    lost = models.PositiveSmallIntegerField(default=0)
    draw = models.PositiveSmallIntegerField(default=0)
    points = models.PositiveSmallIntegerField(default=0)
    runs_scored = models.PositiveSmallIntegerField(default=0)
    runs_given = models.PositiveSmallIntegerField(default=0)
    balls_faced = models.PositiveSmallIntegerField(default=0)
    balls_bowled = models.PositiveSmallIntegerField(default=0)

    objects = StandingsManager()

    def __str__(self) -> str:
        return str(self.team)

    @property
    def _for(self):
        return f"{self.runs_scored}/{self.balls_faced//6}.{self.balls_faced%6}"

    @property
    def _against(self):
        return f"{self.runs_given}/{self.balls_bowled//6}.{self.balls_bowled%6}"

    @property
    def _nrr(self):
        if self.balls_bowled and self.balls_faced:
            return ((self.runs_scored/self.balls_faced) -
                    (self.runs_given/self.balls_bowled))*6
        return 0
