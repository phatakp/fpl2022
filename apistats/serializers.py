from apiteams.serializers import TeamSerializer
from rest_framework import serializers

from .models import MatchHistory, TeamStats


class MatchHistorySerializer(serializers.ModelSerializer):
    team1 = TeamSerializer(many=False, read_only=True)
    team2 = TeamSerializer(many=False, read_only=True)
    winner = TeamSerializer(many=False, read_only=True)

    class Meta:
        model = MatchHistory
        fields = '__all__'


class TeamStatsSerializer(serializers.ModelSerializer):
    team1 = TeamSerializer(many=False, read_only=True)
    team2 = TeamSerializer(many=False, read_only=True)

    class Meta:
        model = TeamStats
        fields = '__all__'
