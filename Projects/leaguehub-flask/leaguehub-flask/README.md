# LeagueHub - Flask Edition

## Quick Start

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\\Scripts\\activate
pip install -r requirements.txt
python run.py
```

Open http://127.0.0.1:5000

## Features
- User signup/login (Flask-Login + password hashing)
- Create & manage multiple leagues
- Add/remove teams
- Auto round-robin fixture generation
- Enter match scores
- Auto-updated league table (3-1-0 points)
- Shareable league links (view-only for non-owners)
- SQLite database (zero config)
