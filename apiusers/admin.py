from django.contrib import admin

from .models import *

# Register your models here.


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_staff')


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'ipl_winner', 'played',
                    'won', 'lost', 'amount', 'doubles', 'ipl_admin')
