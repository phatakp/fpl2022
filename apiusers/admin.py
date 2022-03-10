from django.contrib import admin

from .models import *

# Register your models here.


@admin.register(UserAccount)
class UserAccountAdmin(admin.ModelAdmin):
    list_display = ('email', 'name', 'is_staff')
