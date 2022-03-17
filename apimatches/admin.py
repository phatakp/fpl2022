from django.contrib import admin

from .models import *

# Register your models here.


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ('num', 'date', 'type', 'team1',
                    'team2', 'slug', 'venue', 'min_bet', 'bat_first',
                    'team1_score', 'team2_score', "team1_overs", "team2_overs", 'double')


@admin.register(MatchResult)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('match', 'status', 'winner', 'win_type', 'win_margin')
