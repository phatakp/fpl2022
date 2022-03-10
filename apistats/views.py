
from django.db.models import Q
from rest_framework import generics, permissions, views
from rest_framework.response import Response

from .helpers import *
from .models import TeamStats
from .serializers import TeamStatsSerializer

# Create your views here.


class TeamAllStatsView(views.APIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TeamStatsSerializer

    def get_queryset(self):
        qs = TeamStats.objects.all()
        team1 = self.request.query_params.get('team1')
        team2 = self.request.query_params.get('team2')
        try:
            if not team1 and not team2:
                raise ValueError
            else:
                qs = qs.filter(Q(team1__short_name=team1, team2__short_name=team2) |
                               Q(team1__short_name=team2, team2__short_name=team1)).order_by('team1', 'team2')
                return qs
        except:
            return None

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset is None:
            return Response('Invalid Teams')

        result = dict()
        for record in queryset:
            result.setdefault(record.team1.short_name, dict()).update({record.type: record.played,
                                                                       f"{record.type}_wins": record.won,
                                                                       f"{record.type}_winpct": record.winpct,
                                                                       })
            if record.team2:
                result[record.team1.short_name].update(
                    {'winprob': record.probability})
        return Response(result)
