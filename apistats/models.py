from django.conf import settings
from django.db import models

from .managers import *

# Create your models here.


class MatchHistory(models.Model):
    date = models.DateField()
    team1 = models.ForeignKey("apiteams.Team",
                              on_delete=models.CASCADE,
                              related_name="homeHistory", db_index=True)
    team2 = models.ForeignKey("apiteams.Team",
                              on_delete=models.CASCADE,
                              related_name="awayHistory", db_index=True)
    winner = models.ForeignKey("apiteams.Team",
                               on_delete=models.CASCADE,
                               related_name="winnerHistory",
                               blank=True, null=True, db_index=True)
    bat_first = models.ForeignKey("apiteams.Team",
                                  on_delete=models.CASCADE,
                                  related_name="bat_first",
                                  blank=True, null=True, db_index=True)
    slug = models.SlugField(max_length=100, unique=True, null=True)
    type = models.CharField(max_length=20,
                            choices=settings.STATS_MATCH_TYPES,
                            default=settings.STATS_MATCH_TYPES[0][0])
    status = models.CharField(max_length=20,
                              choices=settings.MATCH_STATUS[1:],
                              default=settings.MATCH_STATUS[1][0])
    win_type = models.CharField(max_length=10,
                                choices=settings.WIN_TYPES,
                                blank=True, null=True)
    win_margin = models.PositiveIntegerField(blank=True, null=True)

    objects = MatchHistoryManager()

    def __str__(self) -> str:
        return self.slug

    @property
    def teams(self):
        return (self.team1, self.team2)

    class Meta:
        ordering = ('date',)


class TeamStats(models.Model):
    team1 = models.ForeignKey("apiteams.Team",
                              on_delete=models.CASCADE,
                              related_name="homeStats", db_index=True)
    team2 = models.ForeignKey("apiteams.Team",
                              on_delete=models.CASCADE,
                              related_name="awayStats",
                              null=True, db_index=True)
    type = models.CharField(max_length=20,
                            choices=settings.STATS_TYPES,
                            default=settings.STATS_TYPES[0][0])
    played = models.PositiveSmallIntegerField(default=0)
    won = models.PositiveSmallIntegerField(default=0)
    probability = models.PositiveSmallIntegerField(default=0)

    objects = TeamStatsManager()

    class Meta:
        unique_together = ('team1', 'team2', 'type')
        verbose_name_plural = "TeamStats"

    def __str__(self) -> str:
        if self.team2:
            return f"{str(self.team1)}-vs-{str(self.team2)}"
        else:
            return f"{str(self.team1)}-all"

    @property
    def winpct(self):
        if self.played > 0:
            return int(self.won/self.played*100)
        return 0
