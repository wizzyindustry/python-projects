# League Manager - Web Application

A modern, user-friendly web application for managing sports leagues. Built with **Python Flask** on the backend and responsive HTML/CSS on the frontend.

## Features ⚽

### Core Features
- **User Authentication**: Secure sign-up and login with password hashing
- **League Management**: Create and manage multiple leagues
- **Team Management**: Add and manage teams in your league
- **Fixture Generation**: Automatic round-robin fixture generation
- **Match Management**: Record match results and scores
- **Auto-Updating Standings**: League table updates automatically with match results
- **League Sharing**: Generate shareable public links for read-only league viewing
- **Responsive Design**: Mobile-friendly interface works on all devices

### Key Highlights
✅ Create multiple leagues as a user
✅ Automatic round-robin fixture scheduling
✅ Real-time league table calculations
✅ Beautiful, intuitive UI with modern design
✅ Public shareable league links
✅ No technical knowledge required

## Technology Stack

- **Backend**: Python 3.8+ with Flask
- **Database**: SQLite (included) or PostgreSQL for production
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Flask-Login with secure password hashing
- **ORM**: SQLAlchemy

## Installation & Setup

### 1. Clone or Download Project
```bash
# Create a project directory
mkdir league-manager
cd league-manager

# Copy all project files into this directory
```

### 2. Create Virtual Environment
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Setup (Optional)
Create a `.env` file in the project root:
```
SECRET_KEY=your-secret-key-here-change-in-production
DATABASE_URL=sqlite:///league_manager.db
FLASK_ENV=development
```

### 5. Initialize Database
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

### 6. Run the Application
```bash
python app.py
```

The application will start at `http://localhost:5000`

## File Structure

```
league-manager/
├── app.py                      # Main Flask application with all routes and models
├── requirements.txt            # Python dependencies
├── league_manager.db          # SQLite database (auto-created)
└── templates/
    ├── base.html              # Base template with navigation and styles
    ├── login.html             # Login page
    ├── register.html          # Registration page
    ├── dashboard.html         # User dashboard with league list
    ├── create_league.html     # League creation form
    ├── league_detail.html     # League management interface
    ├── shared_league.html     # Public read-only league view
    ├── 404.html               # 404 error page
    └── 500.html               # 500 error page
```

## Usage Guide

### Getting Started

1. **Register/Login**
   - Go to localhost:5000
   - Create a new account or login
   - You'll be redirected to your dashboard

2. **Create a League**
   - Click "New League" button
   - Enter league name and description
   - Click "Create League"

3. **Add Teams**
   - Go to the "Teams" tab
   - Click "Add Team"
   - Enter team names
   - Click to generate fixtures when ready

4. **Generate Fixtures**
   - Click "Generate Fixtures (Round Robin)"
   - Automatic round-robin schedule is created
   - All teams will play each other once

5. **Enter Match Results**
   - Go to "Matches" tab
   - Click "Enter Score" on any unplayed match
   - Enter the scores for both teams
   - Click "Save Score"

6. **View Standings**
   - Go to "Standings" tab
   - See the league table sorted by points
   - Table updates automatically after each match

7. **Share League**
   - Copy the public link from the "Overview" tab
   - Share with others to let them view standings and fixtures
   - Public link is read-only (no editing allowed)

## Database Models

### User
- id, username, email, password, created_at
- Relationships: One-to-many with League

### League
- id, name, owner_id, description, created_at, updated_at, share_token
- Relationships: One-to-many with Team, Match, TableEntry

### Team
- id, name, league_id, created_at
- Relationships: One-to-many with Match (as home and away team)

### Match
- id, league_id, team_a_id, team_b_id, team_a_score, team_b_score
- matchday, status (unplayed/played), created_at, updated_at
- Relationships: Many-to-one with League and Team

### TableEntry
- id, league_id, team_id
- played, wins, draws, losses, goals_for, goals_against, points
- Auto-calculates goal_difference and updates from matches

## API Routes

### Authentication
- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### League Management
- `GET /dashboard` - View all user's leagues
- `GET /league/create` - Show league creation form
- `POST /league/create` - Create new league
- `GET /league/<id>` - View league details (edit mode)
- `POST /league/<id>/delete` - Delete a league

### Team Management
- `POST /league/<id>/add-team` - Add team to league
- `POST /league/<id>/delete-team/<team_id>` - Delete team

### Fixture Management
- `POST /league/<id>/generate-fixtures` - Generate round-robin fixtures

### Match Management
- `POST /league/<id>/match/<match_id>/result` - Update match result

### Public Sharing
- `GET /league/share/<share_token>` - View public league (read-only)

## Fixture Generation Algorithm

The application uses the **Circle Method** for round-robin fixture generation:

1. Teams are arranged in a circle
2. For each round, teams in opposite positions play
3. The circle rotates for each subsequent round
4. Each team plays every other team exactly once
5. No team plays twice in the same round

For n teams, there will be n-1 rounds (matchdays).

## League Table Calculations

### Standings Rules
- **Points**: 3 for win, 1 for draw, 0 for loss
- **Sorting**:
  1. Points (descending)
  2. Goal Difference (descending)
  3. Goals Scored (descending)

### Automatic Updates
- Table entries update automatically when match results are entered
- Recalculations happen instantly
- Historical data is preserved

## Deployment (Production)

### Using PostgreSQL
1. Install PostgreSQL
2. Create database: `createdb league_manager`
3. Update `.env`:
   ```
   DATABASE_URL=postgresql://user:password@localhost/league_manager
   ```
4. Install: `pip install psycopg2-binary`

### Using Gunicorn (WSGI Server)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Environment Variables
```
SECRET_KEY=your-very-secret-key-change-this
DATABASE_URL=postgresql://...
FLASK_ENV=production
```

### Security Checklist
- [ ] Change SECRET_KEY to a strong random value
- [ ] Set FLASK_ENV=production
- [ ] Use PostgreSQL instead of SQLite
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookies
- [ ] Add CSRF protection if needed
- [ ] Implement rate limiting

## Future Enhancements

- [ ] Team logos and images
- [ ] Knockout tournament support
- [ ] Home and away fixtures (double round-robin)
- [ ] Admin roles and permissions
- [ ] Email notifications
- [ ] Export to PDF/Excel
- [ ] Advanced analytics and statistics
- [ ] Player management and tracking
- [ ] League seasons/archives
- [ ] Custom point systems
- [ ] Badge/achievement system

## Troubleshooting

### Database Issues
**Problem**: "no such table" error
**Solution**: 
```python
from app import app, db
with app.app_context():
    db.create_all()
```

### Port Already in Use
**Problem**: "Address already in use"
**Solution**: Change port in app.py or kill process using port 5000

### Login Issues
**Problem**: "Invalid username or password"
**Solution**: Make sure you've registered first and username is correct

### Fixtures Not Generating
**Problem**: Error when generating fixtures
**Solution**: Ensure you have at least 2 teams in the league

## Support & Contribution

For issues or feature requests, please document and resolve locally.

## License

This project is open source and available for personal and commercial use.

## Contact

Built with ⚽ by League Manager Team

---

**Happy league managing!**
