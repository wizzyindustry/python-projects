from flask import Blueprint, render_template, redirect, url_for, flash, request
from flask_login import login_user, logout_user, login_required, current_user
from app import db
from app.models import User, League, Team, Match
from app.forms import SignupForm, LoginForm, LeagueForm, TeamForm
from app.utils import generate_fixtures, calculate_table
from collections import OrderedDict

auth_bp = Blueprint("auth", __name__)
main_bp = Blueprint("main", __name__)

@main_bp.route("/")
def landing():
    if current_user.is_authenticated:
        return redirect(url_for("main.dashboard"))
    return render_template("landing.html")

@auth_bp.route("/signup", methods=["GET", "POST"])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        if User.query.filter_by(email=form.email.data).first():
            flash("Email already registered.", "danger")
            return render_template("auth.html", form=form, is_login=False)
        user = User(username=form.username.data, email=form.email.data)
        user.set_password(form.password.data)
        db.session.add(user); db.session.commit()
        login_user(user)
        return redirect(url_for("main.dashboard"))
    return render_template("auth.html", form=form, is_login=False)

@auth_bp.route("/login", methods=["GET", "POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            return redirect(url_for("main.dashboard"))
        flash("Invalid credentials.", "danger")
    return render_template("auth.html", form=form, is_login=True)

@auth_bp.route("/logout")
def logout():
    logout_user()
    return redirect(url_for("main.landing"))

@main_bp.route("/dashboard", methods=["GET", "POST"])
@login_required
def dashboard():
    form = LeagueForm()
    if form.validate_on_submit():
        lg = League(name=form.name.data, owner_id=current_user.id)
        db.session.add(lg); db.session.commit()
        return redirect(url_for("main.league_detail", pk=lg.id))
    leagues = League.query.filter_by(owner_id=current_user.id).order_by(League.created_at.desc()).all()
    return render_template("dashboard.html", leagues=leagues, form=form)

@main_bp.route("/dashboard/delete/<pk>", methods=["POST"])
@login_required
def delete_league(pk):
    lg = League.query.get_or_404(pk)
    if lg.owner_id != current_user.id:
        flash("Not authorized.", "danger"); return redirect(url_for("main.dashboard"))
    db.session.delete(lg); db.session.commit()
    flash("League deleted.", "success")
    return redirect(url_for("main.dashboard"))

@main_bp.route("/league/<pk>")
def league_detail(pk):
    lg = League.query.get_or_404(pk)
    is_owner = current_user.is_authenticated and current_user.id == lg.owner_id
    teams = Team.query.filter_by(league_id=pk).order_by(Team.created_at).all()
    matches = Match.query.filter_by(league_id=pk).order_by(Match.round, Match.id).all()
    table = calculate_table(teams, matches)
    rounds = OrderedDict()
    for m in matches:
        rounds.setdefault(m.round, []).append(m)
    return render_template("league_detail.html", league=lg, is_owner=is_owner,
                           teams=teams, matches=matches, table=table, rounds=rounds.items())

@main_bp.route("/league/<pk>/add-team", methods=["POST"])
@login_required
def add_team(pk):
    lg = League.query.get_or_404(pk)
    if lg.owner_id != current_user.id:
        flash("Not authorized.", "danger"); return redirect(url_for("main.league_detail", pk=pk))
    if lg.matches:
        flash("Cannot add teams after fixtures generated.", "warning")
        return redirect(url_for("main.league_detail", pk=pk))
    name = request.form.get("name", "").strip()
    if name:
        db.session.add(Team(name=name, league_id=pk)); db.session.commit()
    return redirect(url_for("main.league_detail", pk=pk))

@main_bp.route("/league/<pk>/remove-team/<team_pk>", methods=["POST"])
@login_required
def remove_team(pk, team_pk):
    lg = League.query.get_or_404(pk)
    if lg.owner_id != current_user.id:
        flash("Not authorized.", "danger"); return redirect(url_for("main.league_detail", pk=pk))
    if lg.matches:
        flash("Cannot remove teams after fixtures generated.", "warning")
        return redirect(url_for("main.league_detail", pk=pk))
    Team.query.filter_by(id=team_pk, league_id=pk).delete()
    db.session.commit()
    return redirect(url_for("main.league_detail", pk=pk))

@main_bp.route("/league/<pk>/generate", methods=["POST"])
@login_required
def gen_fixtures(pk):
    lg = League.query.get_or_404(pk)
    if lg.owner_id != current_user.id:
        flash("Not authorized.", "danger"); return redirect(url_for("main.league_detail", pk=pk))
    teams = Team.query.filter_by(league_id=pk).all()
    if len(teams) < 2:
        flash("Need at least 2 teams.", "warning")
        return redirect(url_for("main.league_detail", pk=pk))
    Match.query.filter_by(league_id=pk).delete()
    for rnd, home, away in generate_fixtures(teams):
        db.session.add(Match(league_id=pk, round=rnd, home_team_id=home.id, away_team_id=away.id))
    db.session.commit()
    flash("Fixtures generated!", "success")
    return redirect(url_for("main.league_detail", pk=pk))

@main_bp.route("/league/<pk>/score/<match_pk>", methods=["POST"])
@login_required
def update_score(pk, match_pk):
    lg = League.query.get_or_404(pk)
    if lg.owner_id != current_user.id:
        flash("Not authorized.", "danger"); return redirect(url_for("main.league_detail", pk=pk))
    m = Match.query.get_or_404(match_pk)
    try:
        h, a = int(request.form["home_score"]), int(request.form["away_score"])
        if h < 0 or a < 0: raise ValueError
        m.home_score, m.away_score, m.played = h, a, True
        db.session.commit()
    except (ValueError, KeyError):
        flash("Invalid score.", "danger")
    return redirect(url_for("main.league_detail", pk=pk))
