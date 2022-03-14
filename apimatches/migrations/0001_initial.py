# Generated by Django 4.0.3 on 2022-03-10 12:37

import apimatches.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('apiteams', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Match',
            fields=[
                ('num', models.PositiveSmallIntegerField(primary_key=True, serialize=False)),
                ('date', models.DateTimeField()),
                ('slug', models.SlugField(max_length=100, null=True, unique=True)),
                ('venue', models.CharField(max_length=200)),
                ('type', models.CharField(choices=[('league', 'League'), ('qualifier1', 'Qualifier-1'), ('qualifier2', 'Qualifier-2'), ('eliminator', 'Eliminator'), ('final', 'Final')], default='league', max_length=20)),
                ('min_bet', models.PositiveSmallIntegerField(default=30)),
                ('team1_score', models.CharField(blank=True, max_length=10, null=True, validators=[apimatches.validators.score_validator])),
                ('team2_score', models.CharField(blank=True, max_length=10, null=True, validators=[apimatches.validators.score_validator])),
                ('team1_overs', models.FloatField(blank=True, default=20, null=True)),
                ('team2_overs', models.FloatField(blank=True, default=20, null=True)),
                ('bat_first', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='batFirst', to='apiteams.team')),
                ('team1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='home', to='apiteams.team')),
                ('team2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='away', to='apiteams.team')),
            ],
            options={
                'verbose_name_plural': 'Matches',
                'ordering': ('num',),
            },
        ),
        migrations.CreateModel(
            name='MatchResult',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('scheduled', 'Scheduled'), ('completed', 'Completed'), ('abandoned', 'Abandoned')], default='scheduled', max_length=20)),
                ('win_type', models.CharField(blank=True, choices=[('runs', 'Runs'), ('wickets', 'Wickets'), ('super', 'Super Over')], max_length=10, null=True)),
                ('win_margin', models.PositiveIntegerField(blank=True, null=True)),
                ('match', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='apimatches.match')),
                ('winner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='apiteams.team')),
            ],
            options={
                'ordering': ('match',),
            },
        ),
    ]