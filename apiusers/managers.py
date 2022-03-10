
from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.db.models.signals import post_save, pre_save
from django.utils.translation import gettext_lazy as _


class UserAccountManager(BaseUserManager):
    def create_user(self, email, password, **extra_fields):
        """
        Create and save a User with the given email and password.
        """
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        Create and save a SuperUser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, password, **extra_fields)


class UserProfileManager(models.Manager):
    def get_object_or_none(self, *args, **kwargs):
        try:
            return super().get(*args, **kwargs)
        except:
            return

    def bulk_create(self, objs, **kwargs):
        for item in objs:
            pre_save.send(item.__class__, instance=item)
        a = super().bulk_create(objs, **kwargs)
        for item in objs:
            post_save.send(item.__class__, instance=item, created=True)
        return a

    def get_queryset(self):
        return super().get_queryset().select_related('user', 'ipl_winner')
