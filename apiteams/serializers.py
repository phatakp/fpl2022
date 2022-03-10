from rest_framework import serializers

from .models import Standing, Team


class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class StandingSerializer(serializers.ModelSerializer):
    _for = serializers.ReadOnlyField()
    _against = serializers.ReadOnlyField()
    _nrr = serializers.ReadOnlyField()

    class Meta:
        model = Standing
        fields = '__all__'
