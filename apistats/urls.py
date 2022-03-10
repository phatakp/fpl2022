from django.urls import path

from . import views

urlpatterns = [
    path('', views.TeamAllStatsView.as_view()),
]
