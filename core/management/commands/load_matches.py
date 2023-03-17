import json
import os
from datetime import datetime

from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand

Team = apps.get_model("apiteams", "Team")
Match = apps.get_model("apimatches", "Match")
MatchResult = apps.get_model("apimatches", "MatchResult")

url = "https://www.iplt20.com/matches/results/men"


class Command(BaseCommand):
    help = 'Loads IPL matches to DB'

    def handle(self, *args, **kwargs):
        self.upload_matches_db()

    def upload_matches_db(self):
        Match.objects.all().delete()
        MatchResult.objects.all().delete()
        objs = []
        results = []
        with open(os.path.join(settings.BASE_DIR, 'data', 'matches.json'), encoding='utf-8') as data:
            matchesData = json.loads(data.read())

            for match in matchesData:
                try:
                    date_str = f"{match['MatchDateNew']} {match['MatchTime']} +0530"
                    date = datetime.strptime(date_str, '%d %b %Y %H:%M %z')
                    num = int(match['RowNo'])
                    team1 = Team.objects.get(long_name=match['HomeTeamName'])
                    team2 = Team.objects.get(long_name=match['AwayTeamName'])
                    venue = f"{match['GroundName']}, {match['city']}"

                    match = Match(num=num, date=date,
                                  team1=team1,
                                  team2=team2,
                                  type='league', venue=venue)
                    objs.append(match)
                    results.append(MatchResult(match=match))
                except:
                    print(f"{match['RowNo']=}")
                    print(f"{match['FirstBattingTeamCode']=}")
                    print(f"{match['SecondBattingTeamCode']=}")
                    print(f"{match['1Summary']=}")
                    print(f"{match['2Summary']=}")
                    print(f"{match['GroundName']=}")
                    print(f"{match['city']=}")
                    print(f"{match['MatchDateNew']=}")
                    print(f"{match['MatchTime']=}")
                    print(f"{match['HomeTeamName']=}")
                    print(f"{match['AwayTeamName']=}")
                    print(f"{match['MatchOrder']=}")
                    print("---------------------------------------")
                    break
            Match.objects.bulk_create(objs)
            MatchResult.objects.bulk_create(results)
            print("Match Details saved successfully")
