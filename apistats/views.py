
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

    def get(self, request, *args, **kwargs):
        queryset = TeamStats.objects \
            .filter(Q(team1__short_name=kwargs.get('team1')) |
                    Q(team1__short_name=kwargs.get('team2'))) \
            .filter(Q(team2__short_name=kwargs.get('team1')) |
                    Q(team2__short_name=kwargs.get('team2')))

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
