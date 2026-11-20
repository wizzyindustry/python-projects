from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, EmailField, IntegerField
from wtforms.validators import DataRequired, Length, Email, EqualTo

class SignupForm(FlaskForm):
    username = StringField("Username", validators=[DataRequired(), Length(3, 80)])
    email = EmailField("Email", validators=[DataRequired(), Email()])
    password = PasswordField("Password", validators=[DataRequired(), Length(6)])
    confirm = PasswordField("Confirm", validators=[DataRequired(), EqualTo("password")])

class LoginForm(FlaskForm):
    email = EmailField("Email", validators=[DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])

class LeagueForm(FlaskForm):
    name = StringField("League Name", validators=[DataRequired(), Length(1, 100)])

class TeamForm(FlaskForm):
    name = StringField("Team Name", validators=[DataRequired(), Length(1, 100)])

class ScoreForm(FlaskForm):
    home_score = IntegerField("Home", validators=[DataRequired()])
    away_score = IntegerField("Away", validators=[DataRequired()])
