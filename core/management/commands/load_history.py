from datetime import datetime

from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand
from requests_html import HTMLSession

from apistats.helpers import create_stats

Team = apps.get_model("apiteams", "Team")
MatchHistory = apps.get_model("apistats", "MatchHistory")


class Command(BaseCommand):
    help = 'Loads IPL history matches to DB'
    stats = dict()

    def handle(self, *args, **kwargs):
        self.upload_history_db()

    def upload_history_db(self):
        MatchHistory.objects.all().delete()

        urls = ["https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2007%2F08;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2009;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2009%2F10;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2011;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2012;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2013;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2014;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2015;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2016;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2017;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2018;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2019;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2020%2F21;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2021;trophy=117;type=season",
                "https://stats.espncricinfo.com/ci/engine/records/team/match_results.html?id=2022;trophy=117;type=season",
                ]
        session = HTMLSession()
        finals = []
        objs = []
        for url in urls:
            r = session.get(url)
            tables = r.html.find('.engineTable')
            for td in tables[1].find('td'):
                if "[Twenty20]" in td.text:
                    txt = td.text.replace(' at ', ' v ')
                    txt = txt.replace(' final, ', ' v ')
                    txt = txt.replace(' play-off, ', ' v ')
                    txt = txt.replace(' [Twenty20]', '')
                    txt = txt.split(' v ')
                    finals.append(getSlug(txt))

            for tr in tables[0].find('.data1'):
                t1, t2, *winr, venue, dt, t20 = tr.text.split('\n')
                team1 = Team.objects.get(short_name=getTeam(t1))
                team2 = Team.objects.get(short_name=getTeam(t2))

                date = getDate(dt)
                if len(winr) > 1:
                    winnr, margin = winr
                else:
                    winnr = winr[0]
                if winnr in (t1, t2):
                    winner = Team.objects.get(
                        short_name=getTeam(winnr))
                    status = settings.MATCH_STATUS[1][0]
                    win_margin, win_type = margin.split()
                    win_margin = int(win_margin)
                    if not win_type.endswith('s'):
                        win_type = win_type + 's'
                    bat_first = getBatFirst(winner, team1, team2, win_type)
                else:
                    winner = win_type = win_margin = None
                    status = settings.MATCH_STATUS[2][0]
                objs.append(MatchHistory(team1=team1, team2=team2, date=date,
                                         winner=winner, status=status, bat_first=bat_first,
                                         win_margin=win_margin, win_type=win_type))

        MatchHistory.objects.bulk_create(objs)
        for slug in finals:
            match = MatchHistory.objects.get(slug=slug)
            match.type = settings.STATS_MATCH_TYPES[1][0]
            match.save()
        print("Match History Updated")
        create_stats()


def getBatFirst(winner, t1, t2, type):
    if type == 'runs':
        return winner
    else:
        return t1 if winner.short_name != t1.short_name else t2


def getTeam(name):
    mapping = {
        'Kings XI': 'PBKS',
        'Kings XI Punjab': 'PBKS',
        'Punjab Kings': 'PBKS',
        'Daredevils': 'DC',
        'Capitals': 'DC',
        'Delhi Daredevils': 'DC',
        'Delhi Capitals': 'DC',
        'Mumbai': 'MI',
        'Mumbai Indians': 'MI',
        'Royals': 'RR',
        'Rajasthan Royals': 'RR',
        'Chargers': 'SRH',
        'Sunrisers': 'SRH',
        'Deccan Chargers': 'SRH',
        'Sunrisers Hyderabad': 'SRH',
        'Super Kings': 'CSK',
        'Chennai Super Kings': 'CSK',
        'Royal Challengers Bangalore': 'RCB',
        'RCB': 'RCB',
        'Kolkata Knight Riders': 'KKR',
        'KKR': 'KKR',
        "Kochi": 'KOC',
        "Warriors": 'RPSG',
        "Supergiant": 'RPSG',
        "Supergiants": 'RPSG',
        "Rising Pune Supergiant": 'RPSG',
        "Lucknow Super Giants": 'LSG',
        "Super Giants": 'LSG',
        "Guj Lions": 'GL',
        "Gujarat Lions": 'GL',
        "Gujarat Titans": 'GT',
        "Titans": 'GT',
    }

    team = mapping.get(name)

    if not team:
        print(name)
    return Team.objects.get(short_name=team)


def getSlug(arr):
    return f"{getTeam(arr[0])}vs{getTeam(arr[1])}-{getDate(arr[-1])}"


def getDate(dt):
    if '-' in dt:
        dstr1, dstr2 = dt.split('-')
        dt = dstr1.split()[0] + " " + dstr2
    return datetime.strptime(dt, "%b %d, %Y").date()
