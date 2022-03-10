from django.urls import include, path

from .views import *

urlpatterns = [
    path("", MatchListView.as_view()),
    path("<int:num>/", MatchScoreUpdateView.as_view()),
    path("results/", ResultListView.as_view()),
    path("results/<int:num>/", ResultWinnerUpdateView.as_view()),
    path("results/<slug:slug>/", ResultDetailView.as_view()),
    path('history/', MatchHistoryListView.as_view()),
]
