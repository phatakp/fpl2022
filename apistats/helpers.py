from collections import Counter

import pandas as pd
from django.apps import apps
from django.db.models import Count, F, Q, Sum

from .models import *

Team = apps.get_model('apiteams', 'Team')
teams = Team.objects.all()


def last5_home(historyDF):
    l5_home_matches = historyDF.groupby('team1').apply(lambda x: x.sort_values(
        by='date', ascending=False).head(5).reset_index(drop=True))
    return l5_home_matches[l5_home_matches["winner"] ==
                           l5_home_matches["team1"]]["winner"].value_counts().to_dict()


def last5_away(historyDF):
    l5_away_matches = historyDF.groupby('team2').apply(lambda x: x.sort_values(
        by='date', ascending=False).head(5).reset_index(drop=True))
    return l5_away_matches[l5_away_matches["winner"] ==
                           l5_away_matches["team2"]]["winner"].value_counts().to_dict()


def create_stats():
    TeamStats.objects.all().delete()
    objs = []
    history = MatchHistory.objects.all()
    for team1 in teams:
        for team2 in teams.exclude(short_name=team1.short_name):
            home = history.filter(team1=team1, team2=team2).count()
            home_wins = history.filter(
                team1=team1, team2=team2, winner=team1).count()
            objs.append(TeamStats(team1=team1,
                                  team2=team2,
                                  type=settings.STATS_TYPES[1][0],
                                  played=home,
                                  won=home_wins,
                                  ))

            away = history.filter(team1=team2, team2=team1).count()
            away_wins = history.filter(
                team1=team2, team2=team1, winner=team1).count()
            objs.append(TeamStats(team1=team1,
                                  team2=team2,
                                  type=settings.STATS_TYPES[2][0],
                                  played=away,
                                  won=away_wins,
                                  ))
            objs.append(TeamStats(team1=team1,
                                  team2=team2,
                                  type=settings.STATS_TYPES[0][0],
                                  played=home+away,
                                  won=home_wins+away_wins,
                                  ))

            batfirst = history.filter(Q(team1=team2) | Q(
                team2=team2)).filter(bat_first=team1).count()
            batfirst_wins = history.filter(Q(team1=team2) | Q(
                team2=team2)).filter(bat_first=team1, winner=team1).count()
            objs.append(TeamStats(team1=team1,
                                  team2=team2,
                                  type=settings.STATS_TYPES[3][0],
                                  played=batfirst,
                                  won=batfirst_wins,
                                  ))

            knockout = history.filter(type=settings.STATS_MATCH_TYPES[1][0]).filter(
                Q(team1=team1, team2=team2) | Q(team1=team2, team2=team1)).count()
            knockout_wins = history.filter(Q(team1=team2) | Q(
                team2=team2)).filter(
                type=settings.STATS_MATCH_TYPES[1][0], winner=team1).count()
            objs.append(TeamStats(team1=team1,
                                  team2=team2,
                                  type=settings.STATS_TYPES[4][0],
                                  played=knockout,
                                  won=knockout_wins,
                                  ))

    TeamStats.objects.bulk_create(objs)
    objs = []
    all = TeamStats.objects.values('team1', 'type').annotate(
        played=Sum('played'), won=Sum('won'))

    for item in all:
        objs.append(TeamStats(team1=teams.get(short_name=item['team1']),
                              type=item['type'],
                              played=item['played'],
                              won=item['won']))

    historyDF = pd.DataFrame.from_records(
        MatchHistory.objects.values("date", "team1", "team2", "winner"))
    l5home = last5_home(historyDF)
    l5away = last5_away(historyDF)
    last = Counter(l5home) + Counter(l5away)
    for team, count in last.items():
        objs.append(TeamStats(team1=teams.get(short_name=team),
                              type=settings.STATS_TYPES[-1][0],
                              played=10,
                              won=count))

    TeamStats.objects.bulk_create(objs)
    for team1 in teams:
        for team2 in teams.exclude(short_name=team1.short_name):
            calc_win_prob(team1, team2)
    print('Team Stats created')


def get_prob_for_team(team1, team2):
    stats = TeamStats.objects.filter(team1=team1).filter(Q(team2=team2) |
                                                         Q(team2__isnull=True))
    all = all_vs = home = home_vs = away = away_vs = last = 0
    for rec in stats:
        if rec.team2:
            if rec.type == settings.STATS_TYPES[0][0]:
                all_vs = rec.winpct
            elif rec.type == settings.STATS_TYPES[1][0]:
                home_vs = rec.winpct
            elif rec.type == settings.STATS_TYPES[2][0]:
                away_vs = rec.winpct
            elif rec.type == settings.STATS_TYPES[4][0]:
                k_vs = rec.winpct
        else:
            if rec.type == settings.STATS_TYPES[0][0]:
                all = rec.winpct
            elif rec.type == settings.STATS_TYPES[1][0]:
                home = rec.winpct
            elif rec.type == settings.STATS_TYPES[2][0]:
                away = rec.winpct
            elif rec.type == settings.STATS_TYPES[4][0]:
                k = rec.winpct
            elif rec.type == settings.STATS_TYPES[-1][0]:
                last = rec.winpct

    t = (all+all_vs*2)/3 if all_vs else all
    h = (home+home_vs*2)/3 if home_vs else home
    a = (away+away_vs*2)/3 if away_vs else away
    prob = int(((5*last)+(2.5*h) + (1.5*t)+a)/10)
    return prob


def calc_win_prob(team1, team2):
    prob1 = get_prob_for_team(team1, team2)
    prob2 = get_prob_for_team(team2, team1)
    if prob1 and prob2:
        x = int((prob1 - prob2)/2+50)
        y = 100-x
    else:
        x = y = 0
    TeamStats.objects.filter(team1=team1, team2=team2).update(probability=x)
    TeamStats.objects.filter(team1=team2, team2=team1).update(probability=y)
