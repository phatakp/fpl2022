from django.urls import include, path

from . import views

urlpatterns = [
    path("register/", views.RegisterView.as_view()),
    path("token/refresh/", views.RefreshTokenView.as_view()),
    path("token/logout/", views.LogoutView.as_view()),
    path("token/", views.LoginView.as_view()),
    # path('users/', views.UserListView.as_view()),
    # path('user/', views.LoadUserView.as_view()),
]

urlpatterns += [
    path("api-auth/", include('rest_framework.urls')),
]
