from django.urls import path

from . import views

urlpatterns = [
    path('<str:team1>/<str:team2>/', views.TeamAllStatsView.as_view()),
]
