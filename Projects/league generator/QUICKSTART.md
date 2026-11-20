# League Manager - Quick Start Guide

## 🎯 In 5 Minutes

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Installation (Windows/Mac/Linux)

#### Step 1: Download Files
All project files should be in your `league-manager` directory.

#### Step 2: Run Setup
```bash
python setup.py
```

The setup script will automatically:
- ✅ Create a virtual environment
- ✅ Install all dependencies
- ✅ Create configuration file
- ✅ Initialize the database

#### Step 3: Start the App
```bash
# Activate virtual environment (if not already activated)
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Run the application
python app.py
```

#### Step 4: Open Browser
Go to: **http://localhost:5000**

---

## 📝 First Time Usage

### 1. Register Account
- Click "Sign up"
- Enter username, email, and password
- Click "Create Account"

### 2. Create League
- Click "New League"
- Enter league name (e.g., "Summer 2024 Football")
- Optionally add description
- Click "Create League"

### 3. Add Teams
- Go to "Teams" tab
- Click "Add Team"
- Enter team names
- Add at least 2 teams

### 4. Generate Fixtures
- Click "Generate Fixtures (Round Robin)"
- Confirm the action
- All matches are created automatically!

### 5. Enter Scores
- Go to "Matches" tab
- Click "Enter Score" on any match
- Enter scores for both teams
- Click "Save Score"
- Standings update automatically! ✨

### 6. Share League
- Go to "Overview" tab
- Copy the public link
- Share with others to let them view standings

---

## 🎮 User Interface Walkthrough

### Dashboard
- View all your leagues
- Create new leagues
- Quick stats for each league

### League Management
Has 4 tabs:

**Overview**
- League info and sharing link
- Teams count and match count

**Teams**
- Add/delete teams
- Only available before fixtures generated

**Matches**
- View all fixtures by matchday
- Enter match results
- See match status (played/pending)

**Standings**
- League table with rankings
- Points, wins, draws, losses
- Goal difference calculation
- Auto-sorted by points → goal diff → goals scored

---

## 🔧 Troubleshooting

### "Port 5000 already in use"
```bash
# Change port in app.py line 80 or kill process:
# Windows: taskkill /IM python.exe /F
# Mac/Linux: lsof -ti:5000 | xargs kill -9
```

### "Database error"
```bash
python
>>> from app import app, db
>>> with app.app_context():
...     db.create_all()
>>> exit()
```

### "Can't install dependencies"
```bash
# Make sure virtual environment is activated
# Try upgrading pip:
pip install --upgrade pip
pip install -r requirements.txt
```

### Forgot password
Unfortunately no password reset feature yet. Delete the database and restart:
```bash
rm league_manager.db
python app.py
```

---

## 📊 League Standings Rules

**Points System:**
- Win = 3 points
- Draw = 1 point
- Loss = 0 points

**Tiebreakers (in order):**
1. Total Points
2. Goal Difference (Goals For - Goals Against)
3. Goals Scored

---

## 🌍 Share Your League

Each league gets a unique public link that you can share:
- Link shows standings and fixtures (read-only)
- Others can't edit or delete anything
- Perfect for sharing with participants
- Works on mobile devices

---

## ⚡ Tips & Tricks

1. **Bulk Entry**: Enter multiple match results quickly by doing them one after another
2. **Mobile Friendly**: Access league on phone/tablet - fully responsive!
3. **Multiple Leagues**: Create as many leagues as you need
4. **Backup**: The database file (league_manager.db) contains all data - keep it safe!
5. **Public Link**: Share the public link before matches start to get team admins excited!

---

## 📱 Mobile Access

The app works great on mobile!
- Responsive design fits all screen sizes
- Touch-friendly buttons
- All features available
- Fast performance

Just access the same URL from your phone: `http://your-computer-ip:5000`

---

## 🚀 Next Steps

### Learn More
- Read full README.md for advanced features
- Explore settings by looking at app.py code
- Customize colors in base.html CSS

### Features Coming Soon
- Home & Away fixtures (double round-robin)
- Knockout tournaments
- Team logos
- PDF export
- Email notifications
- League seasons

---

## ❓ Questions or Issues?

1. Check the troubleshooting section above
2. Review the full README.md
3. Check the code comments in app.py
4. All code is well-documented and readable

---

**Enjoy managing your league! ⚽**

For full documentation, see README.md
