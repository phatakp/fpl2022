from django.urls import path

from . import views

urlpatterns = [
    path('', views.TeamListView.as_view()),
    path('standings/', views.StandingListView.as_view()),
]
