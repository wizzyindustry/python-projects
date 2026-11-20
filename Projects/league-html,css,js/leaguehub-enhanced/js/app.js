
const App = {
  currentView: "landing",
  currentLeagueId: null,

  init() {
    // Check for shared league link
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get("view");
    if (viewId) { this.currentLeagueId = viewId; this.render("league-detail"); return; }
    const session = Auth.getSession();
    this.render(session ? "dashboard" : "landing");
  },

  render(view) {
    this.currentView = view;
    const app = document.getElementById("app");
    switch (view) {
      case "landing": app.innerHTML = this.landingPage(); break;
      case "auth-login": app.innerHTML = this.authPage("login"); break;
      case "auth-signup": app.innerHTML = this.authPage("signup"); break;
      case "dashboard": app.innerHTML = this.dashboardPage(); break;
      case "league-detail": app.innerHTML = this.leagueDetailPage(); break;
    }
    this.bindEvents();
    window.scrollTo(0, 0);
  },

  landingPage() {
    return `
      <nav class="navbar"><div class="container">
        <div class="navbar-brand">${icon("trophy")}<span>LeagueHub</span></div>
        <div class="navbar-actions">
          <button class="btn btn-ghost" onclick="App.render('auth-login')">Log in</button>
          <button class="btn btn-primary btn-sm" onclick="App.render('auth-signup')">Get Started</button>
        </div>
      </div></nav>

      <section class="hero"><div class="container">
        <div class="hero-content animate-fade">
          <h1>Manage Your Leagues<br><span class="highlight">Like a Pro</span></h1>
          <p>Create leagues, generate fixtures, track results, and share standings — all in one simple platform built for organizers.</p>
          <div class="hero-buttons">
            <button class="btn btn-hero" onclick="App.render('auth-signup')">Start Free</button>
            <button class="btn btn-hero-outline" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">See Features</button>
          </div>
          <div class="stats-bar">
            <div class="stat"><div class="stat-value">100%</div><div class="stat-label">Free to Use</div></div>
            <div class="stat"><div class="stat-value">< 1min</div><div class="stat-label">League Setup</div></div>
            <div class="stat"><div class="stat-value">∞</div><div class="stat-label">Leagues</div></div>
          </div>
        </div>
      </div></section>

      <section id="features" class="features"><div class="container">
        <div class="section-header animate-slide-up">
          <h2>Everything You Need</h2>
          <p>From league creation to live standings — manage it all without spreadsheets.</p>
        </div>
        <div class="feature-grid">
          ${[
            { icon: "🏆", title: "Create Leagues", desc: "Set up a new league in under a minute with a simple, guided flow.", cls: "blue" },
            { icon: "👥", title: "Manage Teams", desc: "Add, edit, and organize teams effortlessly before the season starts.", cls: "green" },
            { icon: "📅", title: "Auto Fixtures", desc: "Generate round-robin fixtures automatically — no manual scheduling.", cls: "orange" },
            { icon: "📊", title: "Live Standings", desc: "Tables update instantly as you enter match results. Points, GD, and more.", cls: "blue" },
            { icon: "🔗", title: "Share Leagues", desc: "Give participants a public link to follow standings and results in real-time.", cls: "green" },
            { icon: "⚡", title: "Fast & Simple", desc: "No spreadsheets, no complexity — just clean, beautiful league management.", cls: "orange" },
          ].map((f, i) => `
            <div class="feature-card animate-slide-up delay-${i + 1}">
              <div class="feature-icon ${f.cls}">${f.icon}</div>
              <h3>${f.title}</h3>
              <p>${f.desc}</p>
            </div>
          `).join("")}
        </div>
      </div></section>

      <section class="cta"><div class="container">
        <h2>Ready to ditch the spreadsheets?</h2>
        <p>Join organizers who save hours every season with automated league management.</p>
        <button class="btn btn-hero" onclick="App.render('auth-signup')">Create Your First League</button>
      </div></section>

      <footer class="footer"><div class="container">© ${new Date().getFullYear()} LeagueHub. Built for organizers.</div></footer>
    `;
  },

  authPage(mode) {
    const isLogin = mode === "login";
    return `
      <div class="auth-page">
        <div class="auth-left">
          <div class="auth-form-wrap animate-fade">
            <h2>${isLogin ? "Welcome back" : "Create your account"}</h2>
            <p class="subtitle">${isLogin ? "Log in to manage your leagues" : "Start organizing leagues in minutes"}</p>
            <form id="auth-form">
              ${!isLogin ? '<div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="auth-name" placeholder="John Doe" required></div>' : ""}
              <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="auth-email" type="email" placeholder="you@example.com" required></div>
              <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="auth-pass" type="password" placeholder="••••••••" minlength="6" required></div>
              <button class="btn btn-primary btn-lg" type="submit" style="width:100%">${isLogin ? "Log In" : "Sign Up"}</button>
            </form>
            <div class="auth-toggle">
              ${isLogin
                ? 'Don\'t have an account? <a onclick="App.render('auth-signup')">Sign up</a>'
                : 'Already have an account? <a onclick="App.render('auth-login')">Log in</a>'}
            </div>
          </div>
        </div>
        <div class="auth-right">
          <div class="auth-promo animate-fade">
            <h2>${icon("trophy")}<br>LeagueHub</h2>
            <p>The simplest way to run your sports leagues.</p>
            <ul class="feature-list">
              <li>Create unlimited leagues</li>
              <li>Auto-generate fixtures</li>
              <li>Real-time standings</li>
              <li>Share with participants</li>
              <li>Works on any device</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  },

  dashboardPage() {
    const user = Auth.getSession();
    if (!user) { this.render("auth-login"); return ""; }
    const leagues = LeagueStore.getLeagues(user.id);
    return `
      <nav class="navbar"><div class="container">
        <div class="navbar-brand">${icon("trophy")}<span>LeagueHub</span></div>
        <div class="navbar-actions">
          <div class="user-badge"><div class="avatar">${user.name.charAt(0).toUpperCase()}</div>${user.name}</div>
          <button class="btn btn-ghost btn-sm" onclick="Auth.logout(); App.render('landing')">${icon("logout")} Logout</button>
        </div>
      </div></nav>
      <div class="container" style="padding-top:28px; padding-bottom:40px;">
        <div class="page-header animate-fade">
          <h1>My Leagues</h1>
          <button class="btn btn-primary" id="btn-new-league">${icon("plus")} New League</button>
        </div>
        ${leagues.length === 0 ? `
          <div class="card"><div class="empty-state animate-slide-up">
            <div class="empty-icon">🏆</div>
            <h3>No leagues yet</h3>
            <p>Create your first league and start organizing matches in under a minute.</p>
            <button class="btn btn-primary" id="btn-new-league-empty">${icon("plus")} Create League</button>
          </div></div>
        ` : `
          <div class="league-grid">
            ${leagues.map((l, i) => {
              const teams = LeagueStore.getTeams(l.id);
              const matches = LeagueStore.getMatches(l.id);
              const played = matches.filter(m => m.played).length;
              const total = matches.length;
              const pct = total > 0 ? Math.round(played / total * 100) : 0;
              return `
                <div class="card league-card animate-slide-up delay-${Math.min(i + 1, 5)}" data-league-id="${l.id}">
                  <div class="card-body">
                    <div class="league-name">${l.name}</div>
                    <div class="league-meta">
                      <span>${icon("users")} ${teams.length} teams</span>
                      <span>${icon("calendar")} ${played}/${total} matches</span>
                    </div>
                    ${total > 0 ? `<div class="progress-bar" style="background:var(--border);height:4px;border-radius:2px;"><div class="progress-fill" style="width:${pct}%;background:var(--accent);"></div></div>` : ""}
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                      <span class="badge ${total > 0 && pct === 100 ? 'badge-success' : total > 0 ? 'badge-primary' : 'badge-warning'}">${total === 0 ? 'Setup' : pct === 100 ? 'Completed' : 'In Progress'}</span>
                      <button class="btn btn-danger btn-sm btn-delete-league" data-id="${l.id}" title="Delete">${icon("trash")}</button>
                    </div>
                  </div>
                </div>
              `;
            }).join("")}
          </div>
        `}
      </div>
    `;
  },

  leagueDetailPage() {
    const league = LeagueStore.getLeague(this.currentLeagueId);
    if (!league) return '<div class="container" style="padding:80px 0;text-align:center;"><h2>League not found</h2><button class="btn btn-primary mt-3" onclick="App.render('dashboard')">Back</button></div>';
    const user = Auth.getSession();
    const isOwner = user && league.ownerId === user.id;
    const teams = LeagueStore.getTeams(league.id);
    const matches = LeagueStore.getMatches(league.id);
    const table = calculateTable(teams, matches);
    const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
    const played = matches.filter(m => m.played).length;
    const total = matches.length;
    const pct = total > 0 ? Math.round(played / total * 100) : 0;
    const shareUrl = window.location.origin + window.location.pathname + "?view=" + league.id;

    return `
      <nav class="navbar"><div class="container">
        <div class="navbar-brand">
          <button class="btn btn-ghost btn-icon" onclick="App.render('${user ? 'dashboard' : 'landing'}')">${icon("back")}</button>
          ${icon("trophy")}<span>${league.name}</span>
        </div>
        <div class="navbar-actions">
          <button class="btn btn-outline btn-sm" id="btn-copy-link">${icon("copy")} Share</button>
        </div>
      </div></nav>

      <div class="container" style="padding-top:24px;padding-bottom:40px;">
        <div class="card league-header-card animate-fade">
          <div class="card-body">
            <div class="league-header-info">
              <h1>${league.name}</h1>
              <p>${teams.length} teams · ${played}/${total} matches played</p>
              ${total > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>` : ""}
            </div>
            <div class="league-header-stats">
              <div class="league-stat"><div class="val">${teams.length}</div><div class="lbl">Teams</div></div>
              <div class="league-stat"><div class="val">${rounds.length}</div><div class="lbl">Rounds</div></div>
              <div class="league-stat"><div class="val">${pct}%</div><div class="lbl">Complete</div></div>
            </div>
          </div>
        </div>

        <div class="share-bar animate-fade" id="share-bar" style="display:none;">
          <input value="${shareUrl}" readonly id="share-url">
          <button class="btn btn-primary btn-sm" id="btn-do-copy">${icon("copy")} Copy</button>
        </div>

        <div class="tabs animate-fade">
          <button class="tab-btn active" data-tab="standings">Standings</button>
          <button class="tab-btn" data-tab="fixtures">Fixtures</button>
          ${isOwner ? '<button class="tab-btn" data-tab="teams">Teams</button>' : ""}
        </div>

        <!-- Standings -->
        <div class="tab-content active" id="tab-standings">
          <div class="card">
            <div class="card-header"><h3>League Table</h3></div>
            <div class="card-body no-pad">
              ${table.length === 0 ? '<div class="empty-state"><div class="empty-icon">📊</div><h3>No standings yet</h3><p>Add teams and generate fixtures to see the table.</p></div>' : `
                <div class="table-wrap"><table class="data-table">
                  <thead><tr>
                    <th class="text-center" style="width:36px">#</th><th>Team</th>
                    <th class="text-center">P</th><th class="text-center">W</th><th class="text-center">D</th><th class="text-center">L</th>
                    <th class="text-center">GF</th><th class="text-center">GA</th><th class="text-center">GD</th><th class="text-center">Pts</th><th class="text-center">Form</th>
                  </tr></thead>
                  <tbody>
                    ${table.map((e, i) => `
                      <tr class="${i === 0 ? 'rank-1' : ''}">
                        <td class="text-center font-bold">${i + 1}</td>
                        <td class="font-bold">${e.team}</td>
                        <td class="text-center">${e.played}</td>
                        <td class="text-center">${e.wins}</td>
                        <td class="text-center">${e.draws}</td>
                        <td class="text-center">${e.losses}</td>
                        <td class="text-center">${e.goalsFor}</td>
                        <td class="text-center">${e.goalsAgainst}</td>
                        <td class="text-center">${e.goalDifference > 0 ? '+' : ''}${e.goalDifference}</td>
                        <td class="text-center font-bold">${e.points}</td>
                        <td class="text-center">${e.form.map(f => `<span class="badge ${f === 'W' ? 'badge-success' : f === 'L' ? 'badge-warning' : 'badge-primary'}" style="margin:1px;min-width:22px;display:inline-block;text-align:center;">${f}</span>`).join("")}</td>
                      </tr>
                    `).join("")}
                  </tbody>
                </table></div>
              `}
            </div>
          </div>
        </div>

        <!-- Fixtures -->
        <div class="tab-content" id="tab-fixtures">
          ${isOwner && matches.length === 0 && teams.length >= 2 ? `
            <div class="text-center mb-2"><button class="btn btn-primary" id="btn-gen-fixtures">${icon("shuffle")} Generate Fixtures</button></div>
          ` : ""}
          ${matches.length === 0 ? `
            <div class="card"><div class="empty-state"><div class="empty-icon">📅</div><h3>No fixtures yet</h3><p>${teams.length < 2 ? "Add at least 2 teams first." : "Generate fixtures to create the schedule."}</p></div></div>
          ` : rounds.map(r => `
            <div class="card round-card">
              <div class="card-header"><h3>Round ${r}</h3><span class="badge badge-primary">${matches.filter(m=>m.round===r&&m.played).length}/${matches.filter(m=>m.round===r).length}</span></div>
              <div class="card-body">
                ${matches.filter(m => m.round === r).map(m => `
                  <div class="match-row ${m.played ? 'match-played' : 'match-unplayed'}" data-match-id="${m.id}">
                    <span class="match-team home">${m.homeTeam}</span>
                    <div class="match-score">
                      ${isOwner ? `
                        <input class="score-input" type="number" min="0" value="${m.homeScore !== null ? m.homeScore : ''}" data-field="home" data-match="${m.id}">
                        <span class="divider">–</span>
                        <input class="score-input" type="number" min="0" value="${m.awayScore !== null ? m.awayScore : ''}" data-field="away" data-match="${m.id}">
                        <button class="btn btn-ghost btn-icon btn-save-score" data-match="${m.id}" title="Save">${icon("check")}</button>
                      ` : `
                        <span class="score-display">${m.played ? m.homeScore : '-'}</span>
                        <span class="divider">–</span>
                        <span class="score-display">${m.played ? m.awayScore : '-'}</span>
                      `}
                    </div>
                    <span class="match-team away">${m.awayTeam}</span>
                  </div>
                `).join("")}
              </div>
            </div>
          `).join("")}
        </div>

        <!-- Teams -->
        ${isOwner ? `
          <div class="tab-content" id="tab-teams">
            <div class="card">
              <div class="card-header"><h3>Teams (${teams.length})</h3></div>
              <div class="card-body">
                <form id="add-team-form" class="form-row mb-2">
                  <input class="form-input" id="team-name-input" placeholder="Enter team name" maxlength="50" style="flex:1" required>
                  <button class="btn btn-primary btn-sm" type="submit">${icon("plus")} Add</button>
                </form>
                ${teams.length === 0 ? '<p style="color:var(--text-muted);font-size:0.9rem;">No teams yet. Add your first team above.</p>' : `
                  <div>
                    ${teams.map((t, i) => `
                      <div class="team-item">
                        <span class="team-name"><span class="team-number">${i + 1}</span>${t.name}</span>
                        ${matches.length === 0 ? `<button class="btn btn-danger btn-icon btn-remove-team" data-id="${t.id}" title="Remove">${icon("trash")}</button>` : ''}
                      </div>
                    `).join("")}
                  </div>
                `}
                ${teams.length >= 2 ? `<div class="mt-3"><button class="btn btn-primary" id="btn-gen-fixtures">${icon("shuffle")} ${matches.length > 0 ? "Regenerate" : "Generate"} Fixtures</button></div>` : ""}
              </div>
            </div>
          </div>
        ` : ""}
      </div>
    `;
  },

  bindEvents() {
    // Auth form
    const authForm = document.getElementById("auth-form");
    if (authForm) {
      authForm.addEventListener("submit", e => {
        e.preventDefault();
        const email = document.getElementById("auth-email").value;
        const pass = document.getElementById("auth-pass").value;
        const nameEl = document.getElementById("auth-name");
        if (nameEl) {
          const res = Auth.signup(nameEl.value, email, pass);
          if (res.error) { showToast(res.error, "error"); return; }
          showToast("Account created!", "success");
        } else {
          const res = Auth.login(email, pass);
          if (res.error) { showToast(res.error, "error"); return; }
          showToast("Welcome back!", "success");
        }
        this.render("dashboard");
      });
    }

    // New league
    document.querySelectorAll("#btn-new-league, #btn-new-league-empty").forEach(btn => {
      btn.addEventListener("click", () => {
        const name = prompt("League name:");
        if (!name || !name.trim()) return;
        const user = Auth.getSession();
        LeagueStore.createLeague(name.trim(), user.id);
        showToast("League created!", "success");
        this.render("dashboard");
      });
    });

    // Delete league
    document.querySelectorAll(".btn-delete-league").forEach(btn => {
      btn.addEventListener("click", e => {
        e.stopPropagation();
        if (!confirm("Delete this league and all its data?")) return;
        LeagueStore.deleteLeague(btn.dataset.id);
        showToast("League deleted", "info");
        this.render("dashboard");
      });
    });

    // League card click
    document.querySelectorAll(".league-card").forEach(card => {
      card.addEventListener("click", e => {
        if (e.target.closest(".btn-delete-league")) return;
        this.currentLeagueId = card.dataset.leagueId;
        this.render("league-detail");
      });
    });

    // Tabs
    document.querySelectorAll(".tab-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        btn.classList.add("active");
        document.getElementById("tab-" + btn.dataset.tab).classList.add("active");
      });
    });

    // Share
    const copyBtn = document.getElementById("btn-copy-link");
    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        const bar = document.getElementById("share-bar");
        bar.style.display = bar.style.display === "none" ? "flex" : "none";
      });
    }
    const doCopy = document.getElementById("btn-do-copy");
    if (doCopy) {
      doCopy.addEventListener("click", () => {
        document.getElementById("share-url").select();
        navigator.clipboard.writeText(document.getElementById("share-url").value);
        showToast("Link copied!", "success");
      });
    }

    // Add team
    const teamForm = document.getElementById("add-team-form");
    if (teamForm) {
      teamForm.addEventListener("submit", e => {
        e.preventDefault();
        const input = document.getElementById("team-name-input");
        if (!input.value.trim()) return;
        LeagueStore.addTeam(input.value.trim(), this.currentLeagueId);
        showToast("Team added!", "success");
        this.render("league-detail");
        // Reopen teams tab
        setTimeout(() => { document.querySelector('[data-tab="teams"]')?.click(); }, 50);
      });
    }

    // Remove team
    document.querySelectorAll(".btn-remove-team").forEach(btn => {
      btn.addEventListener("click", () => {
        LeagueStore.removeTeam(btn.dataset.id);
        showToast("Team removed", "info");
        this.render("league-detail");
        setTimeout(() => { document.querySelector('[data-tab="teams"]')?.click(); }, 50);
      });
    });

    // Generate fixtures
    const genBtn = document.getElementById("btn-gen-fixtures");
    if (genBtn) {
      genBtn.addEventListener("click", () => {
        const teams = LeagueStore.getTeams(this.currentLeagueId);
        if (teams.length < 2) { showToast("Need at least 2 teams", "error"); return; }
        const fixtures = generateFixtures(teams);
        LeagueStore.saveFixtures(this.currentLeagueId, fixtures);
        showToast("Fixtures generated!", "success");
        this.render("league-detail");
        setTimeout(() => { document.querySelector('[data-tab="fixtures"]')?.click(); }, 50);
      });
    }

    // Save score
    document.querySelectorAll(".btn-save-score").forEach(btn => {
      btn.addEventListener("click", () => {
        const matchId = btn.dataset.match;
        const homeInput = document.querySelector(`input[data-match="${matchId}"][data-field="home"]`);
        const awayInput = document.querySelector(`input[data-match="${matchId}"][data-field="away"]`);
        const h = parseInt(homeInput.value), a = parseInt(awayInput.value);
        if (isNaN(h) || isNaN(a) || h < 0 || a < 0) { showToast("Enter valid scores", "error"); return; }
        LeagueStore.updateMatch(matchId, h, a);
        showToast("Score saved!", "success");
        this.render("league-detail");
        setTimeout(() => { document.querySelector('[data-tab="fixtures"]')?.click(); }, 50);
      });
    });
  }
};

document.addEventListener("DOMContentLoaded", () => App.init());
