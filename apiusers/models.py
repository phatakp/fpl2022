from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import *

# Create your models here.


class UserAccount(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True)
    name = models.CharField(_('name'), max_length=100)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', ]

    objects = UserAccountManager()

    def __str__(self) -> str:
        return self.name.title()


class UserProfile(models.Model):
    user = models.OneToOneField(
        UserAccount, on_delete=models.CASCADE, related_name='profile')
    ipl_winner = models.ForeignKey('apiteams.Team',
                                   on_delete=models.CASCADE,
                                   null=True)
    ipl_admin = models.BooleanField(_('IPL Admin'), default=False)
    played = models.PositiveSmallIntegerField(default=0)
    won = models.PositiveSmallIntegerField(default=0)
    lost = models.PositiveSmallIntegerField(default=0)
    amount = models.FloatField(default=0)
    doubles = models.PositiveSmallIntegerField(default=5)

    objects = UserProfileManager()

    def __str__(self) -> str:
        return str(self.user)

    class Meta:
        ordering = ('-amount', '-won', 'lost')
