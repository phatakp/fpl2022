# Generated by Django 4.0.3 on 2022-03-16 10:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('apiusers', '0002_userprofile'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='doubles',
            field=models.PositiveSmallIntegerField(default=5),
        ),
    ]
