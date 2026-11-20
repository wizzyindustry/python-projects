# 🐍 Python Projects

A collection of Python practice scripts, mini-programs and web projects built while learning programming — from beginner exercises to Flask web apps, a React league manager and a personal portfolio site.

**Author:** [wizzyindustry](https://github.com/wizzyindustry) (Wizzy Inc)

---

## 📑 Table of Contents

- [Getting Started](#-getting-started)
- [Python Scripts](#-python-scripts)
  - [Math & Number Programs](#-math--number-programs)
  - [Converters & Calculators](#-converters--calculators)
  - [Games & Fun](#-games--fun)
  - [System Programs (Tanzania-themed)](#-system-programs-tanzania-themed)
  - [APIs & Internet](#-apis--internet)
  - [GUI, Graphics & Computer Vision](#-gui-graphics--computer-vision)
  - [AI & Automation](#-ai--automation)
  - [OOP & Data Structures](#-oop--data-structures)
  - [Utilities & Windows Tools](#-utilities--windows-tools)
- [Python Learning Practice](#-python-learning-practice)
- [Projects Folder](#-projects-folder)
  - [Flask Web Apps](#-flask-web-apps)
  - [LeagueHub — League Manager Versions](#-leaguehub--league-manager-versions)
  - [Websites](#-websites)
  - [Other Languages](#-other-languages)
  - [Misc Scripts](#-misc-scripts)
- [Repository Structure](#-repository-structure)
- [Technologies Used](#-technologies-used)

---

## 🚀 Getting Started

```bash
git clone https://github.com/wizzyindustry/python-projects.git
cd python-projects
python <script-name>.py
```

Most scripts use only the Python standard library. Some need extra packages — install them as needed:

```bash
pip install requests pygame pyvista numpy opencv-python guizero pandas gpt4all \
            SpeechRecognition pyttsx3 pyautogui wikipedia flask flask-login flask-sqlalchemy
```

---

## 🐍 Python Scripts

### 🔢 Math & Number Programs

| File | Description |
|------|-------------|
| [prime.py](prime.py) | Checks whether a number is prime |
| [LMC.py](LMC.py) | Finds the Lowest Common Multiple (LCM) of two numbers |
| [leap-year.py](leap-year.py) | Checks whether a year is a leap year |
| [triangle.py](triangle.py) | Classifies a triangle as equilateral, isosceles or scalene |
| [matheTable.py](matheTable.py) | Prints the multiplication table of a chosen number |
| [mathematicalTable.py](mathematicalTable.py) | Prints the full 1–10 multiplication grid |
| [random-number.py](random-number.py) | Generates a random number between 1 and 100 |
| [draw.py](draw.py) | Draws a hollow square pattern with `*` |

### 🔄 Converters & Calculators

| File | Description |
|------|-------------|
| [binary-convection.py](binary-convection.py) | Converts decimal to binary, octal and hexadecimal |
| [ASCII-TO-CHAR.py](ASCII-TO-CHAR.py) | Shows the ASCII value of a character |
| [kg-to-miles.py](kg-to-miles.py) | Converts kilometres to miles |
| [body-mass-index.py](body-mass-index.py) | Calculates Body Mass Index (BMI) and weight category |
| [calender.py](calender.py) | Displays a calendar for a given month and year |

### 🎮 Games & Fun

| File | Description |
|------|-------------|
| [RPG.py](RPG.py) | Text-based RPG adventure game (`go` / `get` commands) |
| [pythonGame.py](pythonGame.py) | Snake game built with Pygame |
| [dice.py](dice.py) | Dice rolling game |
| [typing.py](typing.py) | Real-time typing speed test |
| [hacking.py](hacking.py) | "Hacker terminal" text animation effect (just for fun) |
| [greatings.py](greatings.py) | Greets the user by name |

### 🇹🇿 System Programs (Tanzania-themed)

| File | Description |
|------|-------------|
| [bus-ticket.py](bus-ticket.py) | *Dodoma Express* bus ticket booking system |
| [electricity.py](electricity.py) | *TANESCO* electricity bill calculator from meter readings |
| [exam_result.py](exam_result.py) | *UDOM* examination result system |
| [practicle.py](practicle.py) | Mobile-money style USSD menu (toa pesa, tuma pesa, lipa bill…) |
| [task-system.py](task-system.py) | Add / remove / show task manager |
| [loginANDsign.py](loginANDsign.py) | Console sign-up and login system |

### 🌐 APIs & Internet

| File | Description |
|------|-------------|
| [APIrequests.py](APIrequests.py) | Random joke API + weather API requests |
| [randomJockes.py](randomJockes.py) | Fetches a random joke from the Official Joke API |
| [weather.py](weather.py) | Current weather for Dodoma via WeatherAPI (add your own API key) |

### 🖼️ GUI, Graphics & Computer Vision

| File | Description |
|------|-------------|
| [pythonwindow.py](pythonwindow.py) | Simple Tkinter window with a label and button |
| [guis.py](guis.py) | "League Hub" GUI made with guizero |
| [3dstars.py](3dstars.py) | 3D spiral star-field visualisation with PyVista & NumPy |
| [sketch.py](sketch.py) | Live webcam pencil-sketch effect with OpenCV |

### 🤖 AI & Automation

| File | Description |
|------|-------------|
| [gemini_chat.py](gemini_chat.py) | Offline chatbot using GPT4All (no server needed) |
| [javric.py](javric.py) | Voice assistant — speech recognition, text-to-speech, Wikipedia, web browsing |

### 🧱 OOP & Data Structures

| File | Description |
|------|-------------|
| [ex.py](ex.py) | `Student` class example |
| [testSubject.py](testSubject.py) | Abstract `BankAccount` class — abstraction & encapsulation |
| [encryption.py](encryption.py) | Simple character-shift encryption / decryption class |
| [replacementOrder.py](replacementOrder.py) | Removes duplicates from a list while keeping order |
| [error.py](error.py) | Lists all built-in Python exception / error names |
| [filehandle.py](filehandle.py) | Adds two numbers from user input |

### 🛠️ Utilities & Windows Tools

| File | Description |
|------|-------------|
| [alarm.py](alarm.py) | Alarm clock that rings at a set `HH:MM` time |
| [alarm2.py](alarm2.py) | Countdown alarm with beeps *(Windows only — uses `winsound`)* |
| [wifi_password.py](wifi_password.py) | Shows saved Wi-Fi profiles and their passwords *(Windows only — uses `netsh`)* |

---

## 📘 Python Learning Practice

Folder: [`python leaning practice/`](python%20leaning%20practice)

| File | Description |
|------|-------------|
| [basic.py](python%20leaning%20practice/basic.py) | Data types — list, set, tuple, dictionary |
| [conditions.py](python%20leaning%20practice/conditions.py) | `if / elif / else` statements |
| [oparators.py](python%20leaning%20practice/oparators.py) | Arithmetic, comparison, assignment, bitwise & membership operators |
| [testing.py](python%20leaning%20practice/testing.py) | Formatted multiplication table |
| [pcshutdown.py](python%20leaning%20practice/pcshutdown.py) | Shuts down the PC ⚠️ *(Windows — runs immediately!)* |

---

## 📂 Projects Folder

Folder: [`Projects/`](Projects)

### 🌶️ Flask Web Apps

| Project | Description |
|---------|-------------|
| [blog_app](Projects/blog_app) | Blog with user registration, login and post creation (Flask, SQLAlchemy, Flask-Login, SQLite) |
| [login_app](Projects/login_app) | Login / register / dashboard app using Flask-Login |
| [grade Trucker](Projects/grade%20Trucker) | Contact form app with a thank-you page |
| [league generator](Projects/league%20generator) | **League Manager** — Flask app for managing sports leagues (includes install, quickstart & deployment guides) |

### ⚽ LeagueHub — League Manager Versions

The same league management idea built with different stacks:

| Project | Stack |
|---------|-------|
| [leaguehub-flask](Projects/leaguehub-flask/leaguehub-flask) | Python Flask + Jinja templates |
| [league](Projects/league) | React + TypeScript + Vite + Tailwind + shadcn/ui + Supabase |
| [leaguehub](Projects/league-html,css,js/leaguehub) | HTML / CSS / JavaScript |
| [leaguehub-enhanced](Projects/league-html,css,js/leaguehub-enhanced) | HTML / CSS / JS with auth, fixtures and animations |
| [leaguehub-pro](Projects/league-html,css,js/leaguehub-pro) | HTML / CSS / JS — pro version |
| [leaguehub-ultimate](Projects/league-html,css,js/leaguehub-ultimate) | HTML / CSS / JS — ultimate version |
| [leaguehub-django.zip](Projects/leaguehub-django.zip) | Django version (zipped) |

### 🌍 Websites

| Project | Description |
|---------|-------------|
| [Portifolio](Projects/Portifolio) | **Wizzy Inc** personal portfolio — PWA with Firebase, blog, projects and admin pages, poster & logo gallery |
| [business web](Projects/business%20web) | Business / professional services landing page (HTML, CSS, JS) |

### 💻 Other Languages

| Project | Description |
|---------|-------------|
| [Cpp projects/hello.cpp](Projects/Cpp%20projects/hello.cpp) | C++ Hello World |
| [blog_app/ConsoleApp1](Projects/blog_app/ConsoleApp1) | C# .NET console app |

### 📝 Misc Scripts

| File | Description |
|------|-------------|
| [Projects/app.py](Projects/app.py) | Python basics — variables, arithmetic and selection |
| [Projects/panda.py](Projects/panda.py) | Creating a DataFrame with pandas |

---

## 🗂️ Repository Structure

```
python-projects/
├── *.py                        # Standalone Python scripts
├── python leaning practice/    # Beginner Python exercises
└── Projects/
    ├── blog_app/               # Flask blog + C# console app
    ├── business web/           # Business landing page
    ├── Cpp projects/           # C++ practice
    ├── grade Trucker/          # Flask contact form
    ├── league/                 # React + Supabase LeagueHub
    ├── league generator/       # Flask League Manager
    ├── league-html,css,js/     # Vanilla JS LeagueHub versions
    ├── leaguehub-flask/        # Flask LeagueHub
    ├── login_app/              # Flask login system
    └── Portifolio/             # Wizzy Inc portfolio PWA
```

---

## 🧰 Technologies Used

**Languages:** Python · JavaScript · TypeScript · HTML · CSS · C++ · C#
**Python libraries:** Flask · Flask-Login · SQLAlchemy · Pygame · Tkinter · guizero · OpenCV · PyVista · NumPy · pandas · Requests · GPT4All · SpeechRecognition · pyttsx3
**Web:** React · Vite · Tailwind CSS · shadcn/ui · Supabase · Firebase

---

⭐ If you find these projects useful, give the repo a star!
