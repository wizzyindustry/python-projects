#!/usr/bin/env python3
"""
League Manager Setup Script
This script helps set up the League Manager application
"""

import os
import sys
import subprocess
from pathlib import Path

def print_banner():
    print("\n" + "="*50)
    print("  ⚽ LEAGUE MANAGER - SETUP")
    print("="*50 + "\n")

def check_python_version():
    """Check if Python version is 3.8+"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8+ required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        sys.exit(1)
    print(f"✅ Python {version.major}.{version.minor}.{version.micro} detected")

def create_virtual_env():
    """Create virtual environment"""
    if sys.platform == "win32":
        venv_path = "venv"
        activate_cmd = f"{venv_path}\\Scripts\\activate"
    else:
        venv_path = "venv"
        activate_cmd = f"source {venv_path}/bin/activate"
    
    if Path(venv_path).exists():
        print(f"✅ Virtual environment already exists at {venv_path}")
        return venv_path
    
    print(f"📦 Creating virtual environment at {venv_path}...")
    subprocess.check_call([sys.executable, "-m", "venv", venv_path])
    print(f"✅ Virtual environment created")
    print(f"   Activate with: {activate_cmd}")
    
    return venv_path

def install_dependencies():
    """Install required packages"""
    print("\n📚 Installing dependencies...")
    
    req_file = Path("requirements.txt")
    if not req_file.exists():
        print("❌ requirements.txt not found!")
        sys.exit(1)
    
    subprocess.check_call([sys.executable, "-m", "pip", "install", "--upgrade", "pip"])
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    print("✅ Dependencies installed")

def create_env_file():
    """Create .env file if it doesn't exist"""
    env_file = Path(".env")
    if env_file.exists():
        print("✅ .env file already exists")
        return
    
    print("\n⚙️  Creating .env file...")
    import secrets
    secret_key = secrets.token_urlsafe(32)
    
    env_content = f"""# League Manager Configuration
SECRET_KEY={secret_key}
DATABASE_URL=sqlite:///league_manager.db
FLASK_ENV=development
FLASK_DEBUG=1
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print("✅ .env file created")
    print("   Make sure to change SECRET_KEY before deploying to production!")

def init_database():
    """Initialize database"""
    print("\n🗄️  Initializing database...")
    
    try:
        from app import app, db
        
        with app.app_context():
            db.create_all()
        
        print("✅ Database initialized")
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        sys.exit(1)

def create_project_dirs():
    """Create necessary directories"""
    dirs = ["templates"]
    
    for dir_name in dirs:
        dir_path = Path(dir_name)
        if not dir_path.exists():
            dir_path.mkdir()
            print(f"✅ Created directory: {dir_name}")

def main():
    print_banner()
    
    # Check Python version
    check_python_version()
    
    # Create directories
    print("\n📁 Setting up directories...")
    create_project_dirs()
    
    # Create virtual environment
    print("\n🐍 Setting up virtual environment...")
    venv_path = create_virtual_env()
    
    # Install dependencies
    install_dependencies()
    
    # Create .env file
    create_env_file()
    
    # Initialize database
    init_database()
    
    # Final instructions
    print("\n" + "="*50)
    print("  ✅ SETUP COMPLETE!")
    print("="*50)
    print("\n🚀 Next steps:")
    print("   1. Activate virtual environment:")
    
    if sys.platform == "win32":
        print(f"      {venv_path}\\Scripts\\activate")
    else:
        print(f"      source {venv_path}/bin/activate")
    
    print("\n   2. Run the application:")
    print("      python app.py")
    print("\n   3. Open your browser:")
    print("      http://localhost:5000")
    print("\n   4. Register and create your first league!")
    print("\n" + "="*50 + "\n")

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Setup cancelled by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)
