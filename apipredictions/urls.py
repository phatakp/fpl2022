from django.urls import path

from . import views

urlpatterns = [
    path('', views.PredictionListCreateView.as_view()),
    path('<int:id>/double/', views.PredictionDoubleView.as_view()),
    path('<int:id>/', views.PredictionUpdateView.as_view()),
]
