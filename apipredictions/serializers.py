from apimatches.models import Match
from apimatches.serializers import MatchSerializer
from apiteams.models import Team
from apiteams.serializers import TeamSerializer
from apiusers.models import UserProfile
from apiusers.serializers import UserSerializer
from django.db import transaction
from django.db.models import F
from rest_framework import serializers

from .models import Prediction


class PredictionSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False, read_only=True)
    match = MatchSerializer(many=False, read_only=True)
    team = TeamSerializer(many=False, read_only=True)
    team_name = serializers.CharField(required=True, write_only=True)
    match_num = serializers.IntegerField(required=True, write_only=True)

    class Meta:
        model = Prediction
        fields = '__all__'

    def validate_match_num(self, value):
        if not value:
            raise serializers.ValidationError("Match is required")

        match = Match.objects.get_object_or_none(num=value)
        if not match:
            raise serializers.ValidationError("Invalid Match")
        return match

    def validate_team_name(self, value):
        if not value:
            raise serializers.ValidationError("Team is required")

        team = Team.objects.get_object_or_none(short_name=value)
        if not team:
            raise serializers.ValidationError("Invalid Team")
        return team

    def validate_amount(self, value):
        if not value:
            raise serializers.ValidationError("Amount is required")

        # Value should be positive
        if value and value <= 0:
            raise serializers.ValidationError("Invalid Amount")

        return value

    def validate(self, attrs):
        team = attrs.get('team_name')
        match = attrs.get('match_num')
        amount = attrs.get('amount')
        if not self.instance and match.entry_cutoff_passed:
            raise serializers.ValidationError(
                {'match_num': 'Cutoff Passed for match'})
        if team not in match.teams:
            raise serializers.ValidationError({'team_name': 'Invalid Team'})
        if amount < match.min_bet:
            raise serializers.ValidationError({'amount':
                                               f"Amount should be atleast {match.min_bet}"})
        if self.instance and match.is_started:
            raise serializers.ValidationError(
                {'match_num': 'Cutoff Passed for match'})
        if self.instance and self.instance.team == team and amount <= self.instance.amount:
            raise serializers.ValidationError({'amount':
                                               f"Amount should be more than {self.instance.amount}"})
        if self.instance and self.instance.team != team and amount < (self.instance.amount*2):
            raise serializers.ValidationError({'amount':
                                               f"Amount should be atleast {self.instance.amount*2}"})

        return super().validate(attrs)

    @transaction.atomic
    def create(self, validated_data):
        match = validated_data.pop('match_num')
        team = validated_data.pop('team_name')

        prediction = Prediction.objects.create(
            user=self.context.get('request').user,
            match=match,
            team=team,
            **validated_data
        )
        return prediction

    @transaction.atomic
    def update(self, instance, validated_data):
        team = validated_data.pop('team_name')
        amount = validated_data.get('amount')

        instance.team = team
        instance.amount = amount
        instance.save()
        return instance


class PredictionDoubleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = ('double',)

    @transaction.atomic
    def update(self, instance, validated_data):
        if not instance.match.is_started:
            raise serializers.ValidationError(
                'Cannot play double before match starts')
        if instance.match.double_cutoff_passed:
            raise serializers.ValidationError(
                'Cutoff passed for double play')
        if instance.match.double:
            raise serializers.ValidationError(
                'Double already exists for this match')
        if instance.match.type != 'league':
            raise serializers.ValidationError(
                'Double only applicable for league matches')
        if instance.user.profile.doubles <= 0:
            raise serializers.ValidationError(
                'No more double cards left')

        instance.double = True
        instance.amount = F('amount') * 2
        instance.save()
        Match.objects.filter(num=instance.match.num).update(double=True)
        UserProfile.objects.filter(
            user=instance.user).update(doubles=F('doubles')-1)

        return instance
