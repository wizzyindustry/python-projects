# League Manager - Configuration & Deployment Guide

Advanced configuration options and production deployment instructions.

---

## Configuration

### Environment Variables

Create a `.env` file in the project root with these variables:

```env
# Secret key for session management - CHANGE THIS IN PRODUCTION!
SECRET_KEY=your-very-secret-key-change-this

# Database URL
# SQLite: sqlite:///league_manager.db (default, for development only)
# PostgreSQL: postgresql://user:password@localhost/league_manager
# MySQL: mysql+pymysql://user:password@localhost/league_manager
DATABASE_URL=sqlite:///league_manager.db

# Flask environment
# development: Debug mode on, auto-reload
# production: Debug mode off, optimized
FLASK_ENV=development

# Debug mode (only for development!)
FLASK_DEBUG=0

# Optional: set host and port
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

### Application Settings

Edit these in `app.py` if needed:

```python
# Line 8-9: Change database
app.config['SQLALCHEMY_DATABASE_URI'] = 'your-database-url'

# Line 6: Change secret key
app.config['SECRET_KEY'] = 'your-secret-key'

# Line 75: Change host/port
app.run(debug=True, host='0.0.0.0', port=5000)
```

---

## Production Deployment

### Prerequisites for Production
- Linux/Unix server (Ubuntu 20.04+ recommended)
- Python 3.8+
- PostgreSQL 12+ (SQLite not recommended for production)
- Domain name with SSL certificate
- Gunicorn or uWSGI WSGI server
- Nginx or Apache reverse proxy

### Step 1: Server Setup

```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install dependencies
sudo apt-get install -y python3 python3-pip python3-venv \
    postgresql postgresql-contrib nginx git

# Create application user
sudo useradd -m league-app
sudo su - league-app

# Clone/download application
git clone <your-repo> /home/league-app/league-manager
cd /home/league-app/league-manager
```

### Step 2: Python Environment

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
pip install gunicorn
```

### Step 3: PostgreSQL Database

```bash
# Login as postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE league_manager;
CREATE USER league_user WITH PASSWORD 'strong-password-here';
ALTER ROLE league_user SET client_encoding TO 'utf8';
ALTER ROLE league_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE league_user SET default_transaction_deferrable TO on;
ALTER ROLE league_user SET default_transaction_read_committed TO on;
GRANT ALL PRIVILEGES ON DATABASE league_manager TO league_user;
\q
```

### Step 4: Environment Configuration

```bash
# Create .env file with production settings
cat > .env << EOF
SECRET_KEY=$(python3 -c 'import secrets; print(secrets.token_urlsafe(32))')
DATABASE_URL=postgresql://league_user:strong-password-here@localhost/league_manager
FLASK_ENV=production
FLASK_DEBUG=0
EOF

chmod 600 .env
```

### Step 5: Initialize Database

```bash
python3 << EOF
from app import app, db
with app.app_context():
    db.create_all()
print("Database initialized!")
EOF
```

### Step 6: Gunicorn Configuration

Create `gunicorn_config.py`:

```python
import multiprocessing

bind = "127.0.0.1:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "sync"
max_requests = 1000
max_requests_jitter = 50
timeout = 30
keepalive = 2
error_logfile = "/var/log/league-app/gunicorn_error.log"
access_logfile = "/var/log/league-app/gunicorn_access.log"
loglevel = "info"
```

Create log directory:
```bash
sudo mkdir -p /var/log/league-app
sudo chown league-app:league-app /var/log/league-app
```

### Step 7: Systemd Service

Create `/etc/systemd/system/league-app.service`:

```ini
[Unit]
Description=League Manager Application
After=network.target

[Service]
User=league-app
Group=www-data
WorkingDirectory=/home/league-app/league-manager
Environment="PATH=/home/league-app/league-manager/venv/bin"
ExecStart=/home/league-app/league-manager/venv/bin/gunicorn \
          -c gunicorn_config.py app:app

Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Enable and start:
```bash
sudo systemctl daemon-reload
sudo systemctl enable league-app
sudo systemctl start league-app
sudo systemctl status league-app
```

### Step 8: Nginx Configuration

Create `/etc/nginx/sites-available/league-manager`:

```nginx
upstream league_app {
    server 127.0.0.1:8000;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL Certificate (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Logging
    access_log /var/log/nginx/league-access.log;
    error_log /var/log/nginx/league-error.log;

    # Client upload size
    client_max_body_size 10M;

    location / {
        proxy_pass http://league_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static files (if any)
    location /static/ {
        alias /home/league-app/league-manager/static/;
        expires 30d;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/league-manager \
           /etc/nginx/sites-enabled/

sudo nginx -t
sudo systemctl restart nginx
```

### Step 9: SSL Certificate (Let's Encrypt)

```bash
# Install certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renew
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

### Step 10: Firewall

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

---

## Backup & Recovery

### Automated Database Backups

Create `/home/league-app/backup.sh`:

```bash
#!/bin/bash

BACKUP_DIR="/home/league-app/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="league_manager"

mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump -U league_user $DB_NAME | gzip > $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz

# Keep only last 30 days of backups
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$TIMESTAMP.sql.gz"
```

Add to crontab:
```bash
crontab -e

# Add this line (backup daily at 2 AM):
0 2 * * * /home/league-app/backup.sh
```

### Restore from Backup

```bash
# Stop application
sudo systemctl stop league-app

# Restore database
gunzip -c backups/db_backup_20240413_020000.sql.gz | \
    psql -U league_user league_manager

# Start application
sudo systemctl start league-app
```

---

## Monitoring & Logging

### View Logs

```bash
# Application logs
sudo journalctl -u league-app -f

# Nginx logs
sudo tail -f /var/log/nginx/league-access.log
sudo tail -f /var/log/nginx/league-error.log

# Gunicorn logs
sudo tail -f /var/log/league-app/gunicorn_error.log
```

### System Monitoring

```bash
# Install monitoring tools
sudo apt-get install htop iotop nethogs

# Monitor resources
htop
```

---

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for common queries
CREATE INDEX idx_league_owner ON league(owner_id);
CREATE INDEX idx_match_league ON match(league_id);
CREATE INDEX idx_match_status ON match(status);
CREATE INDEX idx_table_league ON table_entry(league_id);
```

### Caching

Add to app.py for caching:
```python
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/league/<id>')
@cache.cached(timeout=300)
def league_detail(league_id):
    ...
```

### Connection Pooling

Update database URL:
```python
DATABASE_URL = 'postgresql://user:pass@localhost/db?\
               pool_size=20&max_overflow=40'
```

---

## Security Checklist

- [ ] Change `SECRET_KEY` to strong random value
- [ ] Set `FLASK_ENV=production`
- [ ] Use HTTPS/SSL certificate
- [ ] Enable database encryption
- [ ] Set strong database password
- [ ] Configure firewall rules
- [ ] Add rate limiting
- [ ] Enable CSRF protection
- [ ] Set secure cookie flags
- [ ] Regular backups enabled
- [ ] Monitor logs regularly
- [ ] Keep dependencies updated
- [ ] Use strong admin passwords

---

## Updating in Production

```bash
# Pull latest code
cd /home/league-app/league-manager
git pull origin main

# Activate venv
source venv/bin/activate

# Update dependencies
pip install -r requirements.txt

# Run migrations (if any)
python3 -c "from app import app, db; \
           with app.app_context(): db.create_all()"

# Restart application
sudo systemctl restart league-app
```

---

## Troubleshooting Production Issues

### Application won't start
```bash
sudo systemctl status league-app
sudo journalctl -u league-app -n 50
```

### Database connection error
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Test connection
psql -U league_user -d league_manager -h localhost
```

### High memory usage
```bash
# Check Gunicorn workers
ps aux | grep gunicorn

# Reduce workers in gunicorn_config.py
```

### Slow responses
```bash
# Check database performance
psql -U league_user -d league_manager -c "EXPLAIN ANALYZE SELECT ..."

# Add indexes if needed
```

---

## Scaling

For larger deployments:

1. **Multiple Gunicorn workers** - Already configured
2. **Load balancer** - Use Nginx upstream
3. **Database replication** - PostgreSQL streaming replication
4. **Caching layer** - Redis for session storage
5. **CDN** - CloudFlare for static content
6. **Monitoring** - Prometheus + Grafana

---

## Support

For deployment issues:
- Check error logs
- Verify all services are running
- Test database connectivity
- Review firewall rules
- Check disk space

Enjoy your production deployment! 🚀
