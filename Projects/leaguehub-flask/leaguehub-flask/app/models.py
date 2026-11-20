import uuid
from datetime import datetime, timezone
from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash
from app import db

def gen_uuid():
    return str(uuid.uuid4())

class User(UserMixin, db.Model):
    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    leagues = db.relationship("League", backref="owner", lazy=True)

    def set_password(self, pw):
        self.password_hash = generate_password_hash(pw)
    def check_password(self, pw):
        return check_password_hash(self.password_hash, pw)

class League(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    name = db.Column(db.String(100), nullable=False)
    owner_id = db.Column(db.String(36), db.ForeignKey("user.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    teams = db.relationship("Team", backref="league", lazy=True, cascade="all,delete-orphan")
    matches = db.relationship("Match", backref="league", lazy=True, cascade="all,delete-orphan")

class Team(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    name = db.Column(db.String(100), nullable=False)
    league_id = db.Column(db.String(36), db.ForeignKey("league.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))

class Match(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=gen_uuid)
    league_id = db.Column(db.String(36), db.ForeignKey("league.id"), nullable=False)
    round = db.Column(db.Integer, nullable=False)
    home_team_id = db.Column(db.String(36), db.ForeignKey("team.id"), nullable=False)
    away_team_id = db.Column(db.String(36), db.ForeignKey("team.id"), nullable=False)
    home_score = db.Column(db.Integer, nullable=True)
    away_score = db.Column(db.Integer, nullable=True)
    played = db.Column(db.Boolean, default=False)
    home_team = db.relationship("Team", foreign_keys=[home_team_id])
    away_team = db.relationship("Team", foreign_keys=[away_team_id])
