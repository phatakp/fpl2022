from django.contrib import admin

from .models import *

# Register your models here.


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('short_name', 'long_name', 'active')


@admin.register(Standing)
class StandingAdmin(admin.ModelAdmin):
    list_display = ('team', 'played', 'won', 'lost', 'draw',
                    'points', '_nrr', '_for', '_against')
