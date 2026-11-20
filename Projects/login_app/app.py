from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "your_secret_key_here"  # Required for sessions

# Setup Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"  # Redirect here if not logged in

# Temporary user storage (acts like a database)
users = {}

# User class
class User(UserMixin):
    def __init__(self, id, name, email, password):
        self.id = id
        self.name = name
        self.email = email
        self.password = password

@login_manager.user_loader
def load_user(user_id):
    return users.get(user_id)

# ---------- REGISTER ----------
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        name = request.form.get("name")
        email = request.form.get("email")
        password = request.form.get("password")

        # Check if email already exists
        for user in users.values():
            if user.email == email:
                flash("Email already registered!", "error")
                return redirect(url_for("register"))

        # Hash the password for security
        hashed_password = generate_password_hash(password)

        # Save the user
        user_id = str(len(users) + 1)
        users[user_id] = User(user_id, name, email, hashed_password)

        flash("Account created! Please log in.", "success")
        return redirect(url_for("login"))

    return render_template("register.html")

# ---------- LOGIN ----------
@app.route("/", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")

        # Find user by email
        user = None
        for u in users.values():
            if u.email == email:
                user = u
                break

        # Check password
        if user and check_password_hash(user.password, password):
            login_user(user)
            return redirect(url_for("dashboard"))
        else:
            flash("Invalid email or password!", "error")

    return render_template("login.html")

# ---------- DASHBOARD ----------
@app.route("/dashboard")
@login_required  # Only logged in users can access this!
def dashboard():
    return render_template("dashboard.html", name=current_user.name)

# ---------- LOGOUT ----------
@app.route("/logout")
@login_required
def logout():
    logout_user()
    flash("You have been logged out.", "success")
    return redirect(url_for("login"))

if __name__ == "__main__":
    app.run(debug=True)