from cgitb import lookup

from apistats.models import MatchHistory
from apistats.serializers import MatchHistorySerializer
from django.db.models import Q
from rest_framework import generics, permissions
from rest_framework.response import Response

from . import permissions as custom_permissions
from .models import Match, MatchResult
from .serializers import MatchResultSerializer, MatchSerializer


# Create your views here.
class MatchListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MatchSerializer
    queryset = Match.objects.all()


class MatchScoreUpdateView(generics.UpdateAPIView):
    permission_classes = [custom_permissions.IsAdminorReadOnly]
    serializer_class = MatchSerializer
    queryset = Match.objects.all()
    lookup_field = 'num'


class ResultListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MatchResultSerializer
    queryset = MatchResult.objects.all()


class ResultDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MatchResultSerializer
    queryset = MatchResult.objects.all()
    lookup_field = 'slug'

    def get_object(self):
        try:
            obj = self.get_queryset().get(match__slug=self.kwargs.get('slug'))
        except:
            obj = None
        return obj


class ResultWinnerUpdateView(generics.UpdateAPIView):
    permission_classes = [custom_permissions.IsAdminorReadOnly]
    serializer_class = MatchResultSerializer
    queryset = MatchResult.objects.all()
    lookup_field = 'num'

    def get_object(self):
        try:
            obj = self.get_queryset().get(match__num=self.kwargs.get('num'))
        except:
            obj = None
        return obj


class MatchHistoryListView(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = MatchHistorySerializer

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        if queryset is not None:
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        else:
            return Response({"error": "Invalid Teams"}, status=400)

    def get_queryset(self):
        qs = MatchHistory.objects.all()
        try:
            team1 = self.request.query_params.get('team1')
            team2 = self.request.query_params.get('team2')
            if team1 and team2:
                qs = qs.filter(
                    Q(team1__short_name=team1, team2__short_name=team2) |
                    Q(team1__short_name=team2, team2__short_name=team1)
                ).order_by('-date')
                return qs
            else:
                raise ValueError
        except:
            return None
