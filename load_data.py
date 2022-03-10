import random
from datetime import datetime

from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import Q
from requests_html import HTMLSession


def setup():
    import os

    import django

    os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                          'backend.settings.production')
    django.setup()


def load_teams():
    Team.objects.all().delete()
    data = [Team(short_name=team, active=team not in ('KOC', 'RPSG', 'GL'))
            for team, _ in settings.TEAM_CHOICES]
    Team.objects.bulk_create(data)
    print("Team details saved")


def load_matches():
    Match.objects.all().delete()
    MatchResult.objects.all().delete()
    objs = []
    results = []
    # maxnum = 0

    # url = "https://www.iplt20.com/matches/results/men/2021"
    # session = HTMLSession()
    # r = session.get(url)
    # matches = r.html.find('#team_archive', first=True)
    # for element in matches.find('li')[::-1]:
    #     teams = []
    #     scores = []
    #     overs = []
    #     for team in element.find('.vn-teamTitle'):
    #         for name in team.find('h3'):
    #             teams.append(Team.objects.get(long_name=name.text))
    #         for score in team.find('p'):
    #             scores.append(score.text)
    #         for over in team.find('span'):
    #             overs.append(over.text.split()[0].split('(')[1].split('/')[0])

    #     result = element.find('.vn-ticketTitle')[0].text
    #     text = result.split('won by')
    #     if len(text) > 1:
    #         winner = Team.objects.get(long_name=text[0].strip())
    #         margin, win_type = text[1].strip().split()
    #         margin = int(margin)
    #     date_txt = element.find('.vn-date')[0].text
    #     desc = element.find('.vn-matchno')[0].text
    #     *num, time_txt = desc.split("IST")[0].split()
    #     date_str = date_txt + " " + time_txt + " +0530"
    #     date = datetime.strptime(date_str, "%A %d %B, %Y %H:%M %z")

    #     if len(num) > 1:
    #         if num[0].lower() == "match":
    #             type = 'league'
    #             match_num = int(num[1])
    #             if match_num > maxnum:
    #                 maxnum = match_num
    #         else:
    #             type = "".join(num).lower()
    #             match_num = maxnum + 1
    #             maxnum = match_num

    #     else:
    #         type = num[0].lower()
    #         match_num = maxnum + 1
    #         maxnum = match_num

    #     venue = element.find('.vn-matchTime')[0].text
    #     match = Match(num=match_num, date=date, team1=teams[0], team2=teams[1],
    #                   type=type, venue=venue, team1_score=scores[0], team2_score=scores[1],
    #                   team1_overs=float(overs[0]), team2_overs=float(overs[1]))
    #     objs.append(match)
    #     results.append(MatchResult(match=match, status="completed", winner=winner,
    #                                win_type=win_type, win_margin=margin))

    matches = [
        {"num": 1, "date": datetime.strptime("25 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "CSK", "team2": "MI", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "18.3", "status": "completed", "winner": "MI", "win_type": "wickets", "win_margin": 6},
        {"num": 2, "date": datetime.strptime("26 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "RR", "team2": "RCB", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "18.3", "status": "completed", "winner": "RCB", "win_type": "wickets", "win_margin": 6},
        {"num": 3, "date": datetime.strptime("27 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "LSG", "team2": "GT", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "18.3", "status": "completed", "winner": "GT", "win_type": "wickets", "win_margin": 6},
        {"num": 4, "date": datetime.strptime("28 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "PBKS", "team2": "KKR", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "18.3", "status": "completed", "winner": "KKR", "win_type": "wickets", "win_margin": 6},
        {"num": 5, "date": datetime.strptime("29 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "DC", "team2": "SRH", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "18.3", "status": "completed", "winner": "SRH", "win_type": "wickets", "win_margin": 6},
        {"num": 6, "date": datetime.strptime("30 March, 2022 15:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "MI", "team2": "RCB", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "20", "status": "completed", "winner": "RCB", "win_type": "runs", "win_margin": 5},
        {"num": 7, "date": datetime.strptime("30 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "RR", "team2": "CSK", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "20", "status": "completed", "winner": "CSK", "win_type": "runs", "win_margin": 5},
        {"num": 8, "date": datetime.strptime("31 March, 2022 15:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "LSG", "team2": "KKR", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "20", "status": "completed", "winner": "KKR", "win_type": "runs", "win_margin": 5},
        {"num": 9, "date": datetime.strptime("31 March, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "GT", "team2": "DC", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "170/9", "team2_score": "175/4",
         "team1_overs": "20", "team2_overs": "20", "status": "completed", "winner": "DC", "win_type": "runs", "win_margin": 5},
        {"num": 10, "date": datetime.strptime("1 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "SRH", "team2": "PBKS", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": "30/1", "team2_score": "175/4",
         "team1_overs": "4.1", "team2_overs": "20", "status": "abandoned", "winner": None, "win_type": None, "win_margin": None},
        {"num": 11, "date": datetime.strptime("2 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "CSK", "team2": "LSG", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 12, "date": datetime.strptime("3 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "MI", "team2": "GT", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 13, "date": datetime.strptime("4 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "PBKS", "team2": "RR", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 14, "date": datetime.strptime("5 April, 2022 15:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "KKR", "team2": "RCB", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 15, "date": datetime.strptime("5 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "DC", "team2": "SRH", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 16, "date": datetime.strptime("6 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "KKR", "team2": "CSK", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 17, "date": datetime.strptime("7 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "PBKS", "team2": "GT", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 18, "date": datetime.strptime("8 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "SRH", "team2": "RR", 'type': "league", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "winner": None, "win_type": None, "win_margin": None},
        {"num": 19, "date": datetime.strptime("9 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "LSG", "team2": "PBKS", 'type': "qualifier1", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "min_bet": 50, "winner": None, "win_type": None, "win_margin": None},
        {"num": 20, "date": datetime.strptime("10 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "MI", "team2": "CSK", 'type': "eliminator", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "min_bet": 50, "winner": None, "win_type": None, "win_margin": None},
        {"num": 21, "date": datetime.strptime("12 April, 2022 19:30 +0530", "%d %B, %Y %H:%M %z"),
         "team1": "LSG", "team2": "CSK", 'type': "final", "venue": "Eden Gardens, Kolkata", "team1_score": None, "team2_score": None,
         "team1_overs": None, "team2_overs": None, "status": "scheduled", "min_bet": 100, "winner": None, "win_type": None, "win_margin": None},
    ]

    for item in matches:
        match = Match(num=item.get('num'), date=item.get('date'), team1=Team.objects.get(short_name=item.get('team1')), team2=Team.objects.get(short_name=item.get('team2')),
                      type=item.get('type'), venue=item.get('venue'), team1_score=item.get("team1_score"), team2_score=item.get("team2_score"), min_bet=item.get("min_bet", 30),
                      team1_overs=item.get("team1_overs"), team2_overs=item.get("team2_overs"))
        objs.append(match)
        results.append(MatchResult(match=match, status=item.get('status'), winner=Team.objects.get_object_or_none(short_name=item.get("winner")),
                                   win_type=item.get("win_type"), win_margin=item.get("win_margin")))
    Match.objects.bulk_create(objs)
    MatchResult.objects.bulk_create(results)
    print("Match Details saved successfully")


def load_history():
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
        "Guj Lions": 'GL',
        "Gujarat Lions": 'GL',
        "Gujarat Titans": 'GT',
    }

    new = mapping.get(name)

    if not new:
        print(name)
    return new


def getDate(dt):
    if '-' in dt:
        dstr1, dstr2 = dt.split('-')
        dt = dstr1.split()[0] + " " + dstr2
    return datetime.strptime(dt, "%b %d, %Y").date()


def getSlug(arr):
    return f"{getTeam(arr[0])}vs{getTeam(arr[1])}-{getDate(arr[-1])}"


def getBatFirst(winner, t1, t2, type):
    if type == 'runs':
        return winner
    else:
        return t1 if winner.short_name != t1.short_name else t2


def create_users():
    import json

    import requests
    get_user_model().objects.exclude(is_staff=True).delete()
    teams = Team.objects.filter(
        active=True).values_list('short_name', flat=True)
    headers = {'content-type': 'application/json'}
    params = [
        {
            "email": "demouser@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo1 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser2@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo2 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser3@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo3 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser4@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo4 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser5@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo5 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser6@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo6 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser7@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo7 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser8@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo8 User",
            'winner': random.choice(teams),
        },
        {
            "email": "demouser9@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Demo9 User",
            'winner': random.choice(teams),
        },
        {
            "email": "praveenphatak@gmail.com",
            "password": "imintcs3",
            "password2": "imintcs3",
            "name": "Praveen Phatak",
            'winner': random.choice(teams),
        },
    ]

    for param in params:
        r = requests.post('http://127.0.0.1:8000/api/register/',
                          data=json.dumps(param), headers=headers)

        if r.status_code == 201:
            print('User created')
        else:
            print(r)
    UserProfile.objects \
        .filter(user__email='praveenphatak@gmail.com') \
        .update(ipl_admin=True)


def load_predictions():
    Prediction.objects.filter(ipl_winner=False).delete()

    objs = []
    matches = Match.objects.all()
    for user in get_user_model().objects.filter(is_staff=False):
        for match in matches:
            teams = Team.objects.filter(Q(short_name=match.team1.short_name) |
                                        Q(short_name=match.team2.short_name))
            objs.append(Prediction(user=user, match=match,
                                   team=random.choice(list(teams)),
                                   amount=random.randint(match.min_bet, match.min_bet+25)))
    Prediction.objects.bulk_create(objs)

    for match in matches:
        matchPreds = Prediction.objects.filter(match=match)
        randPred = matchPreds[random.randint(0, matchPreds.count()-1)]
        Prediction.objects.filter(id=randPred.id).delete()

    print("Predictions uploaded")


if __name__ == '__main__':
    setup()
    from django.apps import apps

    from apistats.helpers import create_stats
    UserProfile = apps.get_model("apiusers", "UserProfile")
    Team = apps.get_model("apiteams", "Team")
    Match = apps.get_model("apimatches", "Match")
    Prediction = apps.get_model("apipredictions", "Prediction")
    MatchResult = apps.get_model("apimatches", "MatchResult")
    MatchHistory = apps.get_model("apistats", "MatchHistory")

    load_teams()
    load_matches()
    load_history()
    create_users()
    load_predictions()
