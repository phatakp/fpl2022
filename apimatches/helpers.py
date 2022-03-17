from apistats.helpers import calc_win_prob
from django.apps import apps
from django.conf import settings
from django.contrib.auth import get_user_model
from django.db.models import F, Q, Sum

Prediction = apps.get_model('apipredictions', 'Prediction')
MatchHistory = apps.get_model('apistats', 'MatchHistory')
Standing = apps.get_model('apiteams', 'Standing')
TeamStats = apps.get_model('apistats', 'TeamStats')


def bets_for_match(match):
    return Prediction.objects.filter(match=match)


def ipl_final_bets():
    return Prediction.objects.filter(ipl_winner=True)


def no_valid_bet_for_match(user, match):
    return not Prediction.objects.filter(user=user,
                                         match=match,
                                         status=settings.PREDICTION_STATUS_TYPES[0][0]).exists()


def add_default_bets(match):
    users = get_user_model().objects.exclude(is_staff=True)
    bet_placed_count = Prediction.objects.filter(match=match).count()
    if users.count() != bet_placed_count:
        for user in users:
            if no_valid_bet_for_match(user, match):
                Prediction.objects.create(user=user, match=match,
                                          amount=match.min_bet,
                                          status=settings.PREDICTION_STATUS_TYPES[1][0])


def settle_bets(result):
    match_bets = bets_for_match(result.match)

    if result.winner:
        update_completed(match_bets, result.winner)
    else:
        update_abandoned(match_bets)

    # Double bet present
    if result.match.double:
        double_bet = match_bets.filter(double=True).first()
        total = 0
        if double_bet.status == settings.PREDICTION_STATUS_TYPES[2][0]:
            for instance in match_bets.filter(status=settings.PREDICTION_STATUS_TYPES[3][0]):
                print(instance.user.name, instance.amount)
                update_prediction(instance, instance.amount, win=False,
                                  final=False, double=True)
                total += instance.amount
            update_prediction(double_bet, total, win=True,
                              final=False, double=True)

    if result.match.type == 'final':
        final_bets = ipl_final_bets()

        if result.winner:
            update_completed(final_bets, result.winner, final=True)
        else:
            update_abandoned(final_bets, final=True)


def update_user(instance, amt, win=True, final=False, double=False):
    if not final and not double:
        instance.played = F('played') + 1
        if win:
            instance.won = F('won') + 1
        else:
            instance.lost = F('lost') + 1

    instance.amount = F('amount') + amt if win else F('amount')-amt
    instance.save(update_fields=['played', 'amount', 'won', 'lost'])


def update_winning_bets(bets, total_win_amt, total_lost_amt, final=False):
    for bet in bets:
        amt = (bet.amount/total_win_amt) * total_lost_amt
        update_prediction(bet, amt, win=True, final=final)


def update_losing_bets(bets, final=False):
    for bet in bets:
        update_prediction(bet, bet.amount, win=False, final=final)


def update_no_result_bets(bets):
    for bet in bets:
        bet.status = settings.PREDICTION_STATUS_TYPES[-1][0]
        bet.save(update_fields=['status'])


def update_prediction(instance, amt, win=True, final=False, double=False):
    instance.result = F('result') + amt if win else F('result')-amt
    instance.status = settings.PREDICTION_STATUS_TYPES[2][
        0] if win else settings.PREDICTION_STATUS_TYPES[3][0]
    instance.save(update_fields=['result', 'status'])
    update_user(instance.user.profile, amt, win, final, double)


def update_defaulters(match_bets, final=False):
    defaulters = match_bets.filter(
        status=settings.PREDICTION_STATUS_TYPES[1][0])
    non_defaulters = match_bets.exclude(
        status=settings.PREDICTION_STATUS_TYPES[1][0])

    # Get total win amount and total loss amount
    total_win_amt = non_defaulters.aggregate(amt=Sum('amount'))['amt']
    total_lost_amt = defaulters.aggregate(amt=Sum('amount'))['amt']

    update_winning_bets(non_defaulters, total_win_amt, total_lost_amt, final)
    update_losing_bets(defaulters, final)


def update_completed(match_bets, winner, final=False):
    winning_bets = match_bets.filter(team=winner)
    losing_bets = match_bets.exclude(team=winner)
    defaulters = match_bets.filter(
        status=settings.PREDICTION_STATUS_TYPES[1][0])

    # Get total win amount and total loss amount
    total_win_amt = winning_bets.aggregate(amt=Sum('amount'))['amt']
    total_lost_amt = losing_bets.aggregate(amt=Sum('amount'))['amt']

    # If both winners and losers
    if total_win_amt and total_lost_amt:
        update_winning_bets(winning_bets, total_win_amt, total_lost_amt, final)
        update_losing_bets(losing_bets, final)

    # If defaulters
    elif total_lost_amt and defaulters:
        update_defaulters(match_bets, final)

    # All bets on same team
    else:
        update_no_result_bets(match_bets)


def update_abandoned(match_bets, final=False):
    defaulters = match_bets.filter(
        status=settings.PREDICTION_STATUS_TYPES[1][0])

    if defaulters:
        update_defaulters(match_bets, final)
    else:
        update_no_result_bets(match_bets)


def update_team_stats(instance):
    # Type All Stats & Last 10 Stats
    TeamStats.objects.filter(team1=instance.team1,
                             type__in=['all', 'last10']) \
        .filter(Q(team2=instance.team2) |
                Q(team2__isnull=True)) \
        .update(played=F('played')+1,
                won=F('won')+1 if instance.winner == instance.team1 else F('won'))

    TeamStats.objects.filter(team1=instance.team2,
                             type__in=['all', 'last10']) \
        .filter(Q(team2=instance.team1) |
                Q(team2__isnull=True)) \
        .update(played=F('played')+1,
                won=F('won')+1 if instance.winner == instance.team2 else F('won'))

    # Type Home Stats
    TeamStats.objects.filter(team1=instance.team1, type='home') \
        .filter(Q(team2=instance.team2) |
                Q(team2__isnull=True)) \
        .update(played=F('played')+1,
                won=F('won')+1 if instance.winner == instance.team1 else F('won'))

    # Type Away Stats
    TeamStats.objects.filter(team1=instance.team2, type='away') \
        .filter(Q(team2=instance.team1) |
                Q(team2__isnull=True)) \
        .update(played=F('played')+1,
                won=F('won')+1 if instance.winner == instance.team2 else F('won'))

    calc_win_prob(instance.team1, instance.team2)


def insert_to_history(result):
    history = MatchHistory(
        date=result.match.date.date(),
        team1=result.match.team1,
        team2=result.match.team2,
        winner=result.winner,
        bat_first=result.match.bat_first,
        type=result.match.type if result.match.type == settings.MATCH_TYPES[
            0][0] else settings.STATS_MATCH_TYPES[1][0],
        status=result.status,
        win_type=result.win_type,
        win_margin=result.win_margin)

    history.save()
    update_team_stats(history)


def prepare_score(score, overs):
    runs, wickets = score.split('/')
    balls = int(((overs*10) // 10) * 6 + ((overs*10) % 10))
    new_balls = balls if int(wickets) < 10 else 120
    return int(runs), new_balls


def update_team(instance, fruns, fballs, aruns, aballs, winner):
    instance.played = F('played') + 1
    instance.runs_scored = F('runs_scored') + fruns
    instance.balls_faced = F('balls_faced') + fballs
    instance.runs_given = F('runs_given') + aruns
    instance.balls_bowled = F('balls_bowled') + aballs
    if instance.team == winner:
        instance.won = F('won') + 1
        instance.points = F('points') + 2
    else:
        instance.lost = F('lost') + 1

    instance.save()


def update_teams(result):
    team1 = Standing.objects.get(team=result.match.team1)
    team2 = Standing.objects.get(team=result.match.team2)

    if result.winner:
        t1runs, t1balls = prepare_score(
            result.match.team1_score, result.match.team1_overs)
        t2runs, t2balls = prepare_score(
            result.match.team2_score, result.match.team2_overs)

        update_team(team1, t1runs, t1balls, t2runs, t2balls, result.winner)
        update_team(team2, t2runs, t2balls, t1runs, t1balls, result.winner)
    else:
        for team in (team1, team2):
            team.played = F('played') + 1
            team.draw = F('draw') + 1
            team.points = F('points') + 1
            team.save(update_fields=['played', 'draw', 'points'])
