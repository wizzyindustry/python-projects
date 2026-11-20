from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from functools import wraps

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-change-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///league_manager.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize database and login manager
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# ===================== DATABASE MODELS =====================

class User(UserMixin, db.Model):
    """User account model"""
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    leagues = db.relationship('League', backref='owner', lazy=True, cascade='all, delete-orphan')

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class League(db.Model):
    """League model"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    share_token = db.Column(db.String(50), unique=True)
    
    teams = db.relationship('Team', backref='league', lazy=True, cascade='all, delete-orphan')
    matches = db.relationship('Match', backref='league', lazy=True, cascade='all, delete-orphan')
    table_entries = db.relationship('TableEntry', backref='league', lazy=True, cascade='all, delete-orphan')


class Team(db.Model):
    """Team model"""
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    matches_home = db.relationship('Match', foreign_keys='Match.team_a_id', backref='team_a_obj', lazy=True)
    matches_away = db.relationship('Match', foreign_keys='Match.team_b_id', backref='team_b_obj', lazy=True)


class Match(db.Model):
    """Match/Fixture model"""
    id = db.Column(db.Integer, primary_key=True)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'), nullable=False)
    team_a_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    team_b_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    team_a_score = db.Column(db.Integer)
    team_b_score = db.Column(db.Integer)
    matchday = db.Column(db.Integer, nullable=False)
    status = db.Column(db.String(20), default='unplayed')  # unplayed, played
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class TableEntry(db.Model):
    """League table entry model"""
    id = db.Column(db.Integer, primary_key=True)
    league_id = db.Column(db.Integer, db.ForeignKey('league.id'), nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey('team.id'), nullable=False)
    
    played = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    draws = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    goals_for = db.Column(db.Integer, default=0)
    goals_against = db.Column(db.Integer, default=0)
    points = db.Column(db.Integer, default=0)
    
    team = db.relationship('Team', backref='table_entry')
    
    @property
    def goal_difference(self):
        return self.goals_for - self.goals_against
    
    def update_from_match(self):
        """Recalculate standings from all matches"""
        self.played = 0
        self.wins = 0
        self.draws = 0
        self.losses = 0
        self.goals_for = 0
        self.goals_against = 0
        self.points = 0
        
        matches = Match.query.filter(
            (Match.league_id == self.league_id) &
            ((Match.team_a_id == self.team_id) | (Match.team_b_id == self.team_id)) &
            (Match.status == 'played')
        ).all()
        
        for match in matches:
            if match.status != 'played':
                continue
                
            is_home = match.team_a_id == self.team_id
            team_score = match.team_a_score if is_home else match.team_b_score
            opponent_score = match.team_b_score if is_home else match.team_a_score
            
            self.played += 1
            self.goals_for += team_score
            self.goals_against += opponent_score
            
            if team_score > opponent_score:
                self.wins += 1
                self.points += 3
            elif team_score == opponent_score:
                self.draws += 1
                self.points += 1
            else:
                self.losses += 1


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


# ===================== ROUTES =====================

@app.route('/')
def index():
    if current_user.is_authenticated:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')
        confirm = request.form.get('confirm')
        
        if not username or not email or not password:
            return render_template('register.html', error='All fields required')
        
        if password != confirm:
            return render_template('register.html', error='Passwords do not match')
        
        if User.query.filter_by(username=username).first():
            return render_template('register.html', error='Username already exists')
        
        if User.query.filter_by(email=email).first():
            return render_template('register.html', error='Email already exists')
        
        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        
        return redirect(url_for('login', success='Account created! Please log in.'))
    
    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            login_user(user)
            return redirect(url_for('dashboard'))
        
        return render_template('login.html', error='Invalid username or password')
    
    return render_template('login.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('login'))


@app.route('/dashboard')
@login_required
def dashboard():
    leagues = League.query.filter_by(owner_id=current_user.id).all()
    return render_template('dashboard.html', leagues=leagues)


@app.route('/league/create', methods=['GET', 'POST'])
@login_required
def create_league():
    if request.method == 'POST':
        name = request.form.get('name')
        description = request.form.get('description', '')
        
        if not name:
            return render_template('create_league.html', error='League name required')
        
        import secrets
        league = League(
            name=name,
            description=description,
            owner_id=current_user.id,
            share_token=secrets.token_urlsafe(16)
        )
        db.session.add(league)
        db.session.commit()
        
        return redirect(url_for('league_detail', league_id=league.id))
    
    return render_template('create_league.html')


@app.route('/league/<int:league_id>')
@login_required
def league_detail(league_id):
    league = League.query.get_or_404(league_id)
    
    # Check authorization
    if league.owner_id != current_user.id:
        return redirect(url_for('dashboard')), 403
    
    teams = Team.query.filter_by(league_id=league_id).all()
    matches = Match.query.filter_by(league_id=league_id).all()
    
    # Get table entries sorted by points, goal difference, goals for
    table = TableEntry.query.filter_by(league_id=league_id).all()
    table.sort(key=lambda x: (-x.points, -x.goal_difference, -x.goals_for))
    
    # Group matches by matchday
    matches_by_matchday = {}
    for match in matches:
        if match.matchday not in matches_by_matchday:
            matches_by_matchday[match.matchday] = []
        matches_by_matchday[match.matchday].append(match)
    
    return render_template('league_detail.html', 
                         league=league, 
                         teams=teams, 
                         table=table,
                         matches_by_matchday=matches_by_matchday)


@app.route('/league/<int:league_id>/add-team', methods=['POST'])
@login_required
def add_team(league_id):
    league = League.query.get_or_404(league_id)
    
    if league.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    team_name = request.form.get('team_name')
    
    if not team_name:
        return jsonify({'error': 'Team name required'}), 400
    
    team = Team(name=team_name, league_id=league_id)
    db.session.add(team)
    db.session.commit()
    
    return jsonify({'success': True, 'team_id': team.id, 'team_name': team.name})


@app.route('/league/<int:league_id>/delete-team/<int:team_id>', methods=['POST'])
@login_required
def delete_team(league_id, team_id):
    league = League.query.get_or_404(league_id)
    
    if league.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    team = Team.query.get_or_404(team_id)
    
    # Can only delete if no matches exist
    if Match.query.filter(
        (Match.team_a_id == team_id) | (Match.team_b_id == team_id)
    ).first():
        return jsonify({'error': 'Cannot delete team with existing matches'}), 400
    
    db.session.delete(team)
    db.session.commit()
    
    return jsonify({'success': True})


@app.route('/league/<int:league_id>/generate-fixtures', methods=['POST'])
@login_required
def generate_fixtures(league_id):
    league = League.query.get_or_404(league_id)
    
    if league.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    teams = Team.query.filter_by(league_id=league_id).all()
    
    if len(teams) < 2:
        return jsonify({'error': 'Need at least 2 teams'}), 400
    
    # Delete existing matches
    Match.query.filter_by(league_id=league_id).delete()
    TableEntry.query.filter_by(league_id=league_id).delete()
    
    # Generate round-robin fixtures
    fixtures = generate_round_robin(teams)
    
    for matchday, matches in enumerate(fixtures, 1):
        for team_a, team_b in matches:
            match = Match(
                league_id=league_id,
                team_a_id=team_a.id,
                team_b_id=team_b.id,
                matchday=matchday,
                status='unplayed'
            )
            db.session.add(match)
    
    # Create table entries for all teams
    for team in teams:
        entry = TableEntry(league_id=league_id, team_id=team.id)
        db.session.add(entry)
    
    db.session.commit()
    
    return jsonify({'success': True, 'total_matchdays': len(fixtures)})


def generate_round_robin(teams):
    """Generate round-robin fixtures using circle method"""
    n = len(teams)
    fixtures = []
    
    # Circle method for round-robin
    teams_list = teams.copy()
    if n % 2 == 1:
        teams_list.append(None)  # Bye for odd number
    
    for _ in range(n - 1):
        matchday = []
        for i in range(len(teams_list) // 2):
            home = teams_list[i]
            away = teams_list[len(teams_list) - 1 - i]
            
            if home and away:
                matchday.append((home, away))
        
        if matchday:
            fixtures.append(matchday)
        
        # Rotate teams
        teams_list = [teams_list[0]] + teams_list[-1:] + teams_list[1:-1]
    
    return fixtures


@app.route('/league/<int:league_id>/match/<int:match_id>/result', methods=['POST'])
@login_required
def update_match_result(league_id, match_id):
    league = League.query.get_or_404(league_id)
    
    if league.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    match = Match.query.get_or_404(match_id)
    team_a_score = request.form.get('team_a_score')
    team_b_score = request.form.get('team_b_score')
    
    try:
        team_a_score = int(team_a_score)
        team_b_score = int(team_b_score)
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid scores'}), 400
    
    match.team_a_score = team_a_score
    match.team_b_score = team_b_score
    match.status = 'played'
    match.updated_at = datetime.utcnow()
    
    db.session.commit()
    
    # Update table entries
    entry_a = TableEntry.query.filter_by(league_id=league_id, team_id=match.team_a_id).first()
    entry_b = TableEntry.query.filter_by(league_id=league_id, team_id=match.team_b_id).first()
    
    entry_a.update_from_match()
    entry_b.update_from_match()
    db.session.commit()
    
    return jsonify({'success': True})


@app.route('/league/share/<share_token>')
def view_shared_league(share_token):
    league = League.query.filter_by(share_token=share_token).first_or_404()
    
    teams = Team.query.filter_by(league_id=league.id).all()
    matches = Match.query.filter_by(league_id=league.id).all()
    
    table = TableEntry.query.filter_by(league_id=league.id).all()
    table.sort(key=lambda x: (-x.points, -x.goal_difference, -x.goals_for))
    
    matches_by_matchday = {}
    for match in matches:
        if match.matchday not in matches_by_matchday:
            matches_by_matchday[match.matchday] = []
        matches_by_matchday[match.matchday].append(match)
    
    return render_template('shared_league.html',
                         league=league,
                         teams=teams,
                         table=table,
                         matches_by_matchday=matches_by_matchday)


@app.route('/league/<int:league_id>/delete', methods=['POST'])
@login_required
def delete_league(league_id):
    league = League.query.get_or_404(league_id)
    
    if league.owner_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    db.session.delete(league)
    db.session.commit()
    
    return jsonify({'success': True})


# ===================== ERROR HANDLERS =====================

@app.errorhandler(404)
def not_found(e):
    return render_template('404.html'), 404


@app.errorhandler(500)
def internal_error(e):
    db.session.rollback()
    return render_template('500.html'), 500


# ===================== MAIN =====================

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)
