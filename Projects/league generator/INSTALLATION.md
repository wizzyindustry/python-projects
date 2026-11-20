# League Manager - Installation Guide

Complete step-by-step installation instructions for Windows, macOS, and Linux.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Windows Installation](#windows-installation)
3. [macOS Installation](#macos-installation)
4. [Linux Installation](#linux-installation)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

You need:
- **Python 3.8 or higher** ([Download here](https://www.python.org/downloads/))
- **pip** (comes with Python)
- A terminal/command prompt
- ~100 MB disk space

### Check Python Installation
Open terminal/command prompt and run:
```bash
python --version
```

You should see: `Python 3.x.x` (3.8+)

If command not found, add Python to PATH or use `python3`

---

## Windows Installation

### Step 1: Download Project Files
Download and extract all project files to a folder:
```
C:\Users\YourName\league-manager\
```

### Step 2: Open Command Prompt
- Press `Win + R`
- Type `cmd` and press Enter
- Navigate to project folder:
```cmd
cd C:\Users\YourName\league-manager
```

### Step 3: Run Setup
```cmd
python setup.py
```

This automatically:
- ✅ Creates virtual environment (`venv` folder)
- ✅ Installs all dependencies
- ✅ Creates `.env` configuration file
- ✅ Initializes SQLite database

### Step 4: Activate Virtual Environment
```cmd
venv\Scripts\activate
```

You should see `(venv)` at the start of your command line.

### Step 5: Run Application
```cmd
python app.py
```

You should see:
```
 * Serving Flask app 'app'
 * Running on http://127.0.0.1:5000
```

### Step 6: Open Browser
Go to: **http://localhost:5000**

---

## macOS Installation

### Step 1: Download Project Files
```bash
# Create project folder
mkdir ~/league-manager
cd ~/league-manager

# Copy all files here
```

### Step 2: Open Terminal
- Press `Cmd + Space`
- Type `terminal` and press Enter
- Navigate to project folder:
```bash
cd ~/league-manager
```

### Step 3: Verify Python
```bash
python3 --version
```

Should show Python 3.8+

### Step 4: Run Setup
```bash
python3 setup.py
```

### Step 5: Activate Virtual Environment
```bash
source venv/bin/activate
```

You should see `(venv)` at the start of your terminal.

### Step 6: Run Application
```bash
python3 app.py
```

### Step 7: Open Browser
Go to: **http://localhost:5000**

---

## Linux Installation

### Step 1: Install Python (if needed)
```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install python3 python3-pip python3-venv

# Fedora
sudo dnf install python3 python3-pip

# Arch
sudo pacman -S python python-pip
```

### Step 2: Download Project Files
```bash
mkdir ~/league-manager
cd ~/league-manager
# Copy all project files here
```

### Step 3: Run Setup
```bash
python3 setup.py
```

### Step 4: Activate Virtual Environment
```bash
source venv/bin/activate
```

### Step 5: Run Application
```bash
python3 app.py
```

### Step 6: Open Browser
Go to: **http://localhost:5000**

---

## Manual Installation (If setup.py doesn't work)

### Step 1: Create Virtual Environment
**Windows:**
```cmd
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### Step 2: Upgrade pip
```bash
pip install --upgrade pip
```

### Step 3: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 4: Create .env File
Create a file named `.env` in the project folder:
```
SECRET_KEY=your-secret-key-here
DATABASE_URL=sqlite:///league_manager.db
FLASK_ENV=development
```

### Step 5: Initialize Database
```bash
python
```

Inside Python shell:
```python
from app import app, db
with app.app_context():
    db.create_all()
exit()
```

### Step 6: Run Application
```bash
python app.py
```

---

## Verification

After installation, verify everything works:

1. **Check Virtual Environment**
   - You should see `(venv)` in your terminal
   - Run: `pip list` - should show Flask, SQLAlchemy, etc.

2. **Check Database**
   - Should have `league_manager.db` file in project folder

3. **Check Web Server**
   - Application should run at http://localhost:5000
   - You should see the login page

4. **Test Registration**
   - Register a test account
   - Try logging in
   - Create a test league

---

## Stopping the Application

To stop the running application:
- Press `Ctrl + C` in terminal

This gracefully shuts down the server.

---

## Next Time You Use It

After the initial installation:

**Windows:**
```cmd
cd C:\Users\YourName\league-manager
venv\Scripts\activate
python app.py
```

**macOS/Linux:**
```bash
cd ~/league-manager
source venv/bin/activate
python3 app.py
```

---

## Troubleshooting

### Problem: "Python command not found"
**Solution**: 
- Check Python is installed: `python --version`
- If using macOS/Linux, try `python3` instead of `python`
- Add Python to PATH (restart computer after)

### Problem: "Port 5000 already in use"
**Solution**:
- Another application is using port 5000
- Edit `app.py` line 80, change `port=5000` to `port=5001`
- Or kill the process using the port

**Windows:**
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**macOS/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Problem: "ModuleNotFoundError: No module named 'flask'"
**Solution**:
- Make sure virtual environment is activated (see `(venv)` in terminal)
- Reinstall dependencies: `pip install -r requirements.txt`

### Problem: "Database error" or "No such table"
**Solution**:
```python
from app import app, db
with app.app_context():
    db.drop_all()
    db.create_all()
```

### Problem: Can't login or access dashboard
**Solution**:
1. Make sure you registered first
2. Try a different browser
3. Clear browser cookies/cache
4. Check database is initialized

### Problem: Setup script won't run
**Solution**:
Follow "Manual Installation" steps instead

### Problem: Still having issues?
1. Check that all files are in correct locations
2. Make sure you're in the correct project directory
3. Read error messages carefully
4. Check README.md for more details

---

## Uninstalling

To remove the application:

1. Delete the project folder
2. That's it! No registry entries or system files are modified

---

## Update to Latest Version

To get updates:
1. Download latest files
2. Replace old files (except `league_manager.db` to keep your data)
3. Run setup.py again
4. Restart application

---

## Getting Help

If you're still having trouble:
1. Read the full README.md
2. Check QUICKSTART.md for usage tips
3. Review code comments in app.py
4. Try manual installation method
5. Make sure Python version is 3.8+

---

**Installation should take about 5 minutes!**

After successful installation, go to QUICKSTART.md for usage instructions.
