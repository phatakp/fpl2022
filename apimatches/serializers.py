from apiteams.serializers import TeamSerializer
from django.apps import apps
from django.conf import settings
from django.db import transaction
from rest_framework import serializers

from .helpers import *
from .models import Match, MatchResult

Team = apps.get_model('apiteams', 'Team')


class MatchSerializer(serializers.ModelSerializer):
    team1 = TeamSerializer(many=False, read_only=True)
    team2 = TeamSerializer(many=False, read_only=True)
    batFirst = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = Match
        fields = '__all__'
        extra_kwargs = {
            'num': {'read_only': True},
            'date': {'read_only': True},
            'venue': {'read_only': True},
        }

    def validate_batFirst(self, value):
        if not self.instance:
            return value
        team = Team.objects.get_object_or_none(short_name=value)
        if not team:
            raise serializers.ValidationError('Invalid Bat First Team')
        return team

    def update(self, instance, validated_data):
        bat_first = validated_data.pop('batFirst')
        validated_data['bat_first'] = bat_first

        for key, value in validated_data.items():
            setattr(instance, key, value)
        instance.save()
        add_default_bets(instance)
        return instance


class MatchResultSerializer(serializers.ModelSerializer):
    match = MatchSerializer(many=False, read_only=True)
    winner = TeamSerializer(many=False, read_only=True)
    winner_name = serializers.CharField(required=False,
                                        write_only=True,
                                        allow_blank=True)
    type = serializers.CharField(required=False,
                                 write_only=True,
                                 allow_blank=True)
    margin = serializers.IntegerField(required=False, write_only=True)
    stat = serializers.CharField(required=True, write_only=True)

    class Meta:
        model = MatchResult
        fields = '__all__'
        optional_fields = ('winner_name', 'type', 'margin')

    def validate_stat(self, value):
        if not self.instance:
            return value

        if not value:
            raise serializers.ValidationError('Status is required')
        valid_statuses = [x[0] for x in settings.MATCH_STATUS[1:]]
        if value not in valid_statuses:
            raise serializers.ValidationError('Invalid Status')
        return value

    def validate_winner_name(self, value):
        if value:
            winner = Team.objects.get_object_or_none(short_name=value)
            if not winner:
                raise serializers.ValidationError('Invalid Winner')
            if winner not in (self.instance.match.teams):
                raise serializers.ValidationError('Invalid Winner')
            return winner

    def validate_type(self, value):
        if value:
            valid_types = [x[0] for x in settings.WIN_TYPES]
            if value not in valid_types:
                raise serializers.ValidationError('Invalid Win Type')
        return value

    def validate(self, attrs):
        status = attrs.get('stat')
        winner = attrs.get('winner_name')
        win_type = attrs.get('type')
        win_margin = attrs.get('margin')

        if status == 'abandoned' and winner:
            raise serializers.ValidationError({'stat': 'Invalid Status'})
        if status == 'completed' and not winner:
            raise serializers.ValidationError(
                {'winner_name': 'Winner is required'})
        if status == 'completed' and not win_type:
            raise serializers.ValidationError(
                {'type': 'Win Type is required'})
        if status == 'completed' and win_type != settings.WIN_TYPES[-1][0] and not win_margin:
            raise serializers.ValidationError(
                {'margin': 'Win Margin is required'})
        if status == "completed" and not (self.instance.match.team1_score and
                                          self.instance.match.team1_overs and
                                          self.instance.match.team2_score and
                                          self.instance.match.team2_overs and
                                          self.instance.match.bat_first):
            raise serializers.ValidationError("Match Score not updated")

        if win_type == 'wickets' and win_margin > 10:
            raise serializers.ValidationError(
                {'margin': 'Invalid Win Margin'})

        return super().validate(attrs)

    @transaction.atomic
    def update(self, instance, validated_data):
        instance.winner = validated_data.get('winner_name', None)
        instance.status = validated_data.get('stat')
        instance.win_type = validated_data.get('type')
        instance.win_margin = validated_data.get('margin')
        instance.save()

        settle_bets(instance)
        insert_to_history(instance)
        if instance.match.type == settings.MATCH_TYPES[0][0]:
            update_teams(instance)

        return instance
