from django.contrib import admin

from .models import Prediction


# Register your models here.
@admin.register(Prediction)
class PredictionAdmin(admin.ModelAdmin):
    list_display = ('user', 'match', 'team', 'amount',
                    'result', 'ipl_winner', 'status')
    list_filter = ('user', 'match')
