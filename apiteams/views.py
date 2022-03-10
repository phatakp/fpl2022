from rest_framework import generics, permissions

from .models import Standing, Team
from .serializers import StandingSerializer, TeamSerializer


# Create your views here.
class TeamListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = TeamSerializer
    queryset = Team.objects.filter(active=True)


class StandingListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = StandingSerializer
    queryset = Standing.objects.filter(team__active=True)
