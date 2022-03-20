import datetime as dt
from cgitb import lookup

from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.settings import api_settings as jwt_settings
from rest_framework_simplejwt.tokens import RefreshToken as RefreshTokenModel
from rest_framework_simplejwt.views import TokenViewBase

from .models import UserProfile
from .serializers import *


class TokenViewBaseWithCookie(TokenViewBase):

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        resp = Response(serializer.validated_data, status=status.HTTP_200_OK)

        # TODO: this should probably be pulled from the token exp
        expiration = (
            dt.datetime.utcnow() + jwt_settings.REFRESH_TOKEN_LIFETIME
        )

        resp.set_cookie(
            settings.JWT_COOKIE_NAME,
            serializer.validated_data["refresh"],
            expires=expiration,
            secure=settings.JWT_COOKIE_SECURE,
            httponly=True,
            samesite=settings.JWT_COOKIE_SAMESITE
        )

        return resp


class RefreshTokenView(TokenViewBaseWithCookie):
    serializer_class = TokenRefreshSerializer


class LoginView(TokenViewBaseWithCookie):
    serializer_class = TokenObtainPairSerializer


class LogoutView(APIView):

    def post(self, *args, **kwargs):
        resp = Response({})
        token = self.request.COOKIES.get(settings.JWT_COOKIE_NAME)
        refresh = RefreshTokenModel(token)
        refresh.blacklist()
        resp.delete_cookie(settings.JWT_COOKIE_NAME)
        return resp


class RegisterView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.AllowAny,)


class UserListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = UserProfile.objects.exclude(user__is_staff=True)


class LoadUserView(generics.RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserProfile.objects.exclude(user__is_staff=True)

    def get_object(self):
        return UserProfile.objects.get_object_or_none(user=self.request.user)


class UserChgPwdView(generics.UpdateAPIView):
    serializer_class = ChgPwdSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserAccount.objects.exclude(is_staff=True)

    def get_object(self):
        return self.request.user


class UserResetPwdView(generics.UpdateAPIView):
    serializer_class = ResetPwdSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = UserAccount.objects.exclude(is_staff=True)
    lookup_field = 'id'


class UserValidateEmailView(generics.RetrieveAPIView):
    serializer_class = UserValidateEmailSerializer
    permission_classes = (permissions.AllowAny,)
    queryset = UserAccount.objects.exclude(is_staff=True)
    lookup_field = 'email'


class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = (permissions.IsAuthenticated,)
    queryset = UserProfile.objects.exclude(user__is_staff=True)

    def get_object(self):
        return self.request.user

    def perform_update(self, serializer):
        UserProfile.objects.filter(user=self.request.user) \
            .update(ipl_winner=serializer.validated_data.get('ipl_winner'))
        return super().perform_update(serializer)
