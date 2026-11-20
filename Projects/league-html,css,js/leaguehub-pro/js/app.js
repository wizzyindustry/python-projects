/* ===== MAIN APP ===== */
const App = {
  currentPage: 'landing',
  currentLeagueId: null,
  currentTab: 'standings',

  init() {
    // Check URL for shared league view
    const params = new URLSearchParams(window.location.search);
    const viewId = params.get('view');
    if (viewId) { this.currentLeagueId = viewId; this.currentPage = 'league'; }
    else if (DB.currentUser()) { this.currentPage = 'dashboard'; }
    this.render();
  },

  navigate(page, data) {
    if (data) {
      if (data.leagueId) this.currentLeagueId = data.leagueId;
      if (data.tab) this.currentTab = data.tab;
    }
    this.currentPage = page;
    this.render();
    window.scrollTo(0, 0);
  },

  render() {
    const app = document.getElementById('app');
    switch (this.currentPage) {
      case 'landing': app.innerHTML = this.renderLanding(); break;
      case 'auth': app.innerHTML = this.renderAuth(); break;
      case 'dashboard': app.innerHTML = this.renderDashboard(); break;
      case 'league': app.innerHTML = this.renderLeagueDetail(); break;
      case 'profile': app.innerHTML = this.renderProfile(); break;
      default: app.innerHTML = this.renderLanding();
    }
    this.bindEvents();
  },

  /* ===== NAVBAR ===== */
  renderNavbar(loggedIn = false) {
    const user = DB.currentUser();
    return `<nav class="navbar"><div class="container flex items-center justify-between">
      <a href="#" class="navbar-brand" onclick="App.navigate(${loggedIn ? "'dashboard'" : "'landing'"});return false">
        ${icon('trophy', 24)} LeagueHub
      </a>
      <button class="hamburger" onclick="document.querySelector('.navbar-links').classList.toggle('open')">
        <span></span><span></span><span></span>
      </button>
      <div class="navbar-links">
        ${loggedIn ? `
          <a href="#" onclick="App.navigate('dashboard');return false">Dashboard</a>
          <a href="#" onclick="App.navigate('profile');return false">Profile</a>
          <button onclick="DB.logout();App.navigate('landing')">Log out</button>
          <div class="navbar-user">
            <div class="navbar-avatar">${(user?.name || 'U')[0].toUpperCase()}</div>
          </div>
        ` : `
          <a href="#" onclick="App.navigate('auth');return false">Log in</a>
          <button class="btn btn-primary btn-sm" onclick="App.navigate('auth')">Get Started</button>
        `}
      </div>
    </div></nav>`;
  },

  /* ===== FOOTER ===== */
  renderFooter() {
    return `<footer class="footer"><div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <h3>${icon('trophy', 22)} LeagueHub</h3>
          <p>The simplest way to create and manage sports leagues. Built for organizers who want results, not complexity.</p>
          <div class="flex gap-2 mt-2">
            <span class="badge badge-teal">Free to Use</span>
            <span class="badge badge-green">Mobile Ready</span>
          </div>
        </div>
        <div class="footer-col">
          <h4>Product</h4>
          <ul>
            <li><a href="#" onclick="App.navigate('auth');return false">Create League</a></li>
            <li><a href="#">Features</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">Pricing</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Help Center</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Community</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Service</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; ${new Date().getFullYear()} LeagueHub. All rights reserved.</span>
        <div class="footer-social">
          <a href="#">${icon('globe', 18)}</a>
          <a href="#">${icon('mail', 18)}</a>
        </div>
      </div>
    </div></footer>`;
  },

  /* ===== LANDING ===== */
  renderLanding() {
    const features = [
      { ic: 'trophy', t: 'Create Leagues', d: 'Set up a new league in under a minute with a simple guided flow.' },
      { ic: 'users', t: 'Manage Teams', d: 'Add, edit, and organize teams effortlessly before the season starts.' },
      { ic: 'calendar', t: 'Auto Fixtures', d: 'Generate round-robin fixtures automatically — no manual scheduling needed.' },
      { ic: 'chart', t: 'Live Standings', d: 'Tables update instantly as you enter match results. Always accurate.' },
      { ic: 'share', t: 'Share Leagues', d: 'Give participants a public link to follow standings and results in real time.' },
      { ic: 'zap', t: 'Fast & Simple', d: 'No spreadsheets, no complexity — just clean, efficient league management.' },
    ];
    return `
      ${this.renderNavbar(false)}
      <section class="hero text-center">
        <div class="container anim-fade">
          <h1>Manage Your Leagues<br><span>Like a Pro</span></h1>
          <p>Create leagues, generate fixtures, track results, and share standings — all in one simple platform built for organizers.</p>
          <div class="flex justify-center gap-2 flex-wrap">
            <button class="btn btn-accent btn-xl" onclick="App.navigate('auth')">Start Free</button>
            <button class="btn btn-secondary btn-xl" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">See Features</button>
          </div>
        </div>
      </section>

      <section id="features" class="features-section text-center">
        <div class="container">
          <h2 class="anim-fade">Everything You Need</h2>
          <p class="subtitle anim-fade">From league creation to live standings — manage it all without spreadsheets.</p>
          <div class="grid-3">
            ${features.map((f, i) => `
              <div class="feature-card anim-fade" style="animation-delay:${i * .08}s">
                <div class="feature-icon">${icon(f.ic, 24)}</div>
                <h3>${f.t}</h3>
                <p>${f.d}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <section class="stats-section">
        <div class="container">
          <div class="stats-grid">
            <div class="stat-item anim-fade"><h3>500+</h3><p>Leagues Created</p></div>
            <div class="stat-item anim-fade" style="animation-delay:.1s"><h3>3,000+</h3><p>Teams Registered</p></div>
            <div class="stat-item anim-fade" style="animation-delay:.2s"><h3>15,000+</h3><p>Matches Tracked</p></div>
            <div class="stat-item anim-fade" style="animation-delay:.3s"><h3>98%</h3><p>User Satisfaction</p></div>
          </div>
        </div>
      </section>

      <section class="cta-section anim-fade">
        <div class="container">
          <h2>Ready to ditch the spreadsheets?</h2>
          <p>Join organizers who save hours every season with automated league management.</p>
          <button class="btn btn-xl" onclick="App.navigate('auth')">Create Your First League</button>
        </div>
      </section>

      ${this.renderFooter()}
    `;
  },

  /* ===== AUTH ===== */
  renderAuth() {
    return `<div class="auth-page">
      <div class="auth-hero anim-fade">
        <h1>Welcome to<br>LeagueHub</h1>
        <p>The all-in-one platform for managing sports leagues. Create, track, and share — effortlessly.</p>
        <ul class="auth-features">
          <li>${icon('check', 20)} Create unlimited leagues</li>
          <li>${icon('check', 20)} Automatic fixture generation</li>
          <li>${icon('check', 20)} Real-time standings updates</li>
          <li>${icon('check', 20)} Shareable public league links</li>
          <li>${icon('check', 20)} Mobile-friendly design</li>
        </ul>
      </div>
      <div class="auth-form-side">
        <div class="auth-form-card anim-scale">
          <h2>Get Started</h2>
          <p class="subtitle">Create your account or sign in</p>
          <div class="auth-tabs">
            <button class="auth-tab active" id="tab-login" onclick="App.switchAuthTab('login')">Log In</button>
            <button class="auth-tab" id="tab-signup" onclick="App.switchAuthTab('signup')">Sign Up</button>
          </div>
          <form id="auth-form" onsubmit="App.handleAuth(event)">
            <div id="name-field" class="form-group hidden">
              <label class="form-label">Full Name</label>
              <input class="form-input" type="text" id="auth-name" placeholder="Your full name">
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input class="form-input" type="email" id="auth-email" placeholder="you@example.com" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input class="form-input" type="password" id="auth-password" placeholder="At least 6 characters" required minlength="6">
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%">Log In</button>
          </form>
          <div id="auth-error" class="form-error mt-1" style="text-align:center"></div>
        </div>
      </div>
    </div>`;
  },

  authMode: 'login',
  switchAuthTab(mode) {
    this.authMode = mode;
    document.getElementById('tab-login').classList.toggle('active', mode === 'login');
    document.getElementById('tab-signup').classList.toggle('active', mode === 'signup');
    document.getElementById('name-field').classList.toggle('hidden', mode === 'login');
    document.querySelector('#auth-form button[type="submit"]').textContent = mode === 'login' ? 'Log In' : 'Create Account';
  },

  handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value;
    const errEl = document.getElementById('auth-error');
    errEl.textContent = '';

    if (this.authMode === 'signup') {
      const name = document.getElementById('auth-name').value.trim();
      if (!name) { errEl.textContent = 'Please enter your name.'; return; }
      const user = DB.createUser(email, password, name);
      if (!user) { errEl.textContent = 'Email already registered.'; return; }
      DB.login(email, password);
      showToast('Account created! Welcome to LeagueHub.', 'success');
      this.navigate('dashboard');
    } else {
      const user = DB.login(email, password);
      if (!user) { errEl.textContent = 'Invalid email or password.'; return; }
      showToast('Welcome back!', 'success');
      this.navigate('dashboard');
    }
  },

  /* ===== DASHBOARD ===== */
  renderDashboard() {
    const user = DB.currentUser();
    if (!user) { this.navigate('landing'); return ''; }
    const leagues = DB.getUserLeagues(user.id);
    const totalTeams = leagues.reduce((s, l) => s + DB.getLeagueTeams(l.id).length, 0);
    const totalMatches = leagues.reduce((s, l) => s + DB.getLeagueMatches(l.id).length, 0);
    const playedMatches = leagues.reduce((s, l) => s + DB.getLeagueMatches(l.id).filter(m => m.played).length, 0);

    return `
      ${this.renderNavbar(true)}
      <div class="dashboard-header">
        <div class="container anim-fade">
          <h1>Welcome back, ${user.name.split(' ')[0]}!</h1>
          <p>Here's an overview of your leagues</p>
          <div class="dashboard-stats">
            <div class="dash-stat"><div class="value">${leagues.length}</div><div class="label">Leagues</div></div>
            <div class="dash-stat"><div class="value">${totalTeams}</div><div class="label">Total Teams</div></div>
            <div class="dash-stat"><div class="value">${totalMatches}</div><div class="label">Total Matches</div></div>
            <div class="dash-stat"><div class="value">${playedMatches}</div><div class="label">Played</div></div>
          </div>
        </div>
      </div>
      <div class="container" style="padding-bottom:60px">
        <div class="flex justify-between items-center mb-3 anim-fade">
          <h2>Your Leagues</h2>
          <button class="btn btn-accent" onclick="App.showCreateLeague()">${icon('plus', 16)} New League</button>
        </div>
        ${leagues.length === 0 ? `
          <div class="empty-state anim-fade">
            ${icon('trophy', 64)}
            <h3>No Leagues Yet</h3>
            <p>Create your first league to get started with fixture generation and standings.</p>
            <button class="btn btn-primary" onclick="App.showCreateLeague()">${icon('plus', 16)} Create League</button>
          </div>
        ` : `
          <div class="grid-2">
            ${leagues.map((l, i) => {
              const teams = DB.getLeagueTeams(l.id);
              const matches = DB.getLeagueMatches(l.id);
              const played = matches.filter(m => m.played).length;
              const total = matches.length;
              const pct = total > 0 ? Math.round(played / total * 100) : 0;
              const status = total === 0 ? 'setup' : (played === total ? 'complete' : 'active');
              const statusLabel = { setup: 'Setup', active: 'In Progress', complete: 'Completed' }[status];
              return `<div class="league-card anim-fade" style="animation-delay:${i * .06}s" onclick="App.navigate('league', {leagueId:'${l.id}'})">
                <div class="flex justify-between items-center">
                  <h3>${l.name}</h3>
                  <span class="league-status status-${status}">● ${statusLabel}</span>
                </div>
                <div class="league-meta">
                  <span>${icon('users', 14)} ${teams.length} teams</span>
                  <span>${icon('calendar', 14)} ${total} matches</span>
                  <span>${icon('clock', 14)} ${new Date(l.createdAt).toLocaleDateString()}</span>
                </div>
                ${total > 0 ? `<div class="league-progress">
                  <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
                  <div class="progress-label"><span>${played}/${total} played</span><span>${pct}%</span></div>
                </div>` : ''}
              </div>`;
            }).join('')}
          </div>
        `}
      </div>
      ${this.renderFooter()}
    `;
  },

  showCreateLeague() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.id = 'modal-overlay';
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.innerHTML = `<div class="modal">
      <div class="modal-header"><h2>Create New League</h2><button class="btn-ghost" onclick="document.getElementById('modal-overlay').remove()">✕</button></div>
      <div class="modal-body">
        <form id="create-league-form" onsubmit="App.createLeague(event)">
          <div class="form-group">
            <label class="form-label">League Name</label>
            <input class="form-input" id="league-name-input" placeholder="e.g. Sunday Football League" required maxlength="60" autofocus>
          </div>
          <div class="form-hint">You can add teams after creating the league.</div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="document.getElementById('modal-overlay').remove()">Cancel</button>
        <button class="btn btn-primary" onclick="document.getElementById('create-league-form').requestSubmit()">Create League</button>
      </div>
    </div>`;
    document.body.appendChild(overlay);
    setTimeout(() => document.getElementById('league-name-input')?.focus(), 100);
  },

  createLeague(e) {
    e.preventDefault();
    const name = document.getElementById('league-name-input').value.trim();
    if (!name) return;
    const user = DB.currentUser();
    const league = DB.createLeague(name, user.id);
    document.getElementById('modal-overlay')?.remove();
    showToast('League created!', 'success');
    this.navigate('league', { leagueId: league.id, tab: 'teams' });
  },

  /* ===== LEAGUE DETAIL ===== */
  renderLeagueDetail() {
    const league = DB.getLeague(this.currentLeagueId);
    if (!league) { this.navigate('dashboard'); return ''; }
    const user = DB.currentUser();
    const isOwner = user && user.id === league.ownerId;
    const teams = DB.getLeagueTeams(league.id);
    const matches = DB.getLeagueMatches(league.id);
    const tab = this.currentTab || 'standings';

    let tabContent = '';
    if (tab === 'standings') tabContent = this.renderStandings(teams, matches);
    else if (tab === 'fixtures') tabContent = this.renderFixtures(teams, matches, isOwner, league.id);
    else if (tab === 'teams') tabContent = this.renderTeamsTab(teams, matches, isOwner, league.id);

    const shareLink = `${window.location.origin}${window.location.pathname}?view=${league.id}`;

    return `
      ${this.renderNavbar(!!user)}
      <div class="league-hero">
        <div class="container anim-fade">
          <div class="breadcrumb"><a href="#" onclick="App.navigate('dashboard');return false">Dashboard</a> / ${league.name}</div>
          <div class="flex justify-between items-center flex-wrap gap-2">
            <h1>${icon('trophy', 24)} ${league.name}</h1>
            <button class="btn btn-secondary btn-sm" onclick="navigator.clipboard.writeText('${shareLink}');showToast('Link copied!','success')">
              ${icon('copy', 14)} Share Link
            </button>
          </div>
        </div>
      </div>
      <div class="container" style="padding:32px 20px 60px">
        <div class="tabs anim-fade">
          <button class="tab ${tab === 'standings' ? 'active' : ''}" onclick="App.currentTab='standings';App.render()">Standings</button>
          <button class="tab ${tab === 'fixtures' ? 'active' : ''}" onclick="App.currentTab='fixtures';App.render()">Fixtures</button>
          ${isOwner ? `<button class="tab ${tab === 'teams' ? 'active' : ''}" onclick="App.currentTab='teams';App.render()">Teams</button>` : ''}
        </div>
        <div class="anim-fade">${tabContent}</div>
      </div>
      ${this.renderFooter()}
    `;
  },

  renderStandings(teams, matches) {
    const table = calculateTable(teams, matches);
    if (table.length === 0) return `<div class="empty-state">${icon('chart', 48)}<h3>No Standings Yet</h3><p>Add teams and generate fixtures to see standings.</p></div>`;
    return `<div class="card"><div class="card-header"><h3>${icon('chart', 18)} League Table</h3></div>
      <div style="overflow-x:auto"><table class="data-table">
        <thead><tr>
          <th class="text-center">#</th><th>Team</th><th class="text-center">P</th><th class="text-center">W</th>
          <th class="text-center">D</th><th class="text-center">L</th><th class="text-center">GF</th>
          <th class="text-center">GA</th><th class="text-center">GD</th><th class="text-center font-bold">Pts</th>
          <th class="text-center">Form</th>
        </tr></thead>
        <tbody>${table.map((e, i) => `<tr class="${i === 0 ? 'rank-1' : ''}">
          <td class="text-center font-bold">${i + 1}</td>
          <td class="font-bold">${e.team}</td>
          <td class="text-center">${e.played}</td><td class="text-center">${e.wins}</td>
          <td class="text-center">${e.draws}</td><td class="text-center">${e.losses}</td>
          <td class="text-center">${e.gf}</td><td class="text-center">${e.ga}</td>
          <td class="text-center">${e.gd > 0 ? '+' : ''}${e.gd}</td>
          <td class="text-center font-bold">${e.pts}</td>
          <td class="text-center"><div class="form-badges">${e.form.map(f => `<span class="form-badge form-${f.toLowerCase()}">${f}</span>`).join('')}</div></td>
        </tr>`).join('')}</tbody>
      </table></div>
    </div>`;
  },

  renderFixtures(teams, matches, isOwner, leagueId) {
    const rounds = [...new Set(matches.map(m => m.round))].sort((a, b) => a - b);
    if (matches.length === 0) {
      return `<div class="empty-state">${icon('calendar', 48)}<h3>No Fixtures Yet</h3>
        <p>${teams.length < 2 ? 'Add at least 2 teams first.' : "Go to the Teams tab to generate fixtures."}</p>
        ${isOwner && teams.length >= 2 ? `<button class="btn btn-accent" onclick="App.genFixtures('${leagueId}')">${icon('shuffle', 16)} Generate Fixtures</button>` : ''}
      </div>`;
    }
    return rounds.map(r => {
      const rm = matches.filter(m => m.round === r);
      const played = rm.filter(m => m.played).length;
      return `<div class="round-card card">
        <div class="card-header"><div class="round-header">Round ${r} <span class="round-badge">${played}/${rm.length} played</span></div></div>
        <div class="card-body" style="padding:16px">
          ${rm.map(m => `<div class="match-row">
            <span class="match-team home">${m.homeTeam}</span>
            <div class="match-score">
              ${isOwner ? `
                <input class="score-input" type="number" min="0" value="${m.played ? m.homeScore : ''}" id="h-${m.id}" onchange="App.saveScore('${m.id}')">
                <span class="divider">-</span>
                <input class="score-input" type="number" min="0" value="${m.played ? m.awayScore : ''}" id="a-${m.id}" onchange="App.saveScore('${m.id}')">
              ` : `
                <span class="score">${m.played ? m.homeScore : '-'}</span>
                <span class="divider">-</span>
                <span class="score">${m.played ? m.awayScore : '-'}</span>
              `}
            </div>
            <span class="match-team away">${m.awayTeam}</span>
          </div>`).join('')}
        </div>
      </div>`;
    }).join('');
  },

  saveScore(matchId) {
    const h = parseInt(document.getElementById('h-' + matchId).value);
    const a = parseInt(document.getElementById('a-' + matchId).value);
    if (isNaN(h) || isNaN(a) || h < 0 || a < 0) return;
    DB.updateMatch(matchId, h, a);
    showToast('Score saved!', 'success');
    // Re-render to update standings
    this.render();
  },

  renderTeamsTab(teams, matches, isOwner, leagueId) {
    return `<div class="card">
      <div class="card-header flex justify-between items-center">
        <h3>${icon('users', 18)} Teams (${teams.length})</h3>
      </div>
      <div class="card-body">
        ${isOwner ? `<form onsubmit="App.addTeam(event, '${leagueId}')" class="flex gap-1 mb-3">
          <input class="form-input" id="new-team-input" placeholder="Team name" maxlength="50" style="max-width:300px" required>
          <button class="btn btn-primary btn-sm" type="submit">${icon('plus', 14)} Add</button>
        </form>` : ''}
        ${teams.length === 0 ? '<p style="color:var(--gray-300)">No teams yet. Add your first team above.</p>' :
          teams.map(t => `<div class="flex items-center justify-between" style="padding:12px 16px;background:var(--gray-50);border-radius:8px;margin-bottom:8px">
            <span style="font-weight:600">${t.name}</span>
            ${isOwner && matches.length === 0 ? `<button class="btn btn-ghost btn-sm" onclick="App.removeTeam('${t.id}')" title="Remove">${icon('trash', 16)}</button>` : ''}
          </div>`).join('')}
        ${isOwner && teams.length >= 2 ? `<div class="mt-3">
          <button class="btn btn-accent" onclick="App.genFixtures('${leagueId}')">${icon('shuffle', 16)} ${matches.length > 0 ? 'Regenerate' : 'Generate'} Fixtures</button>
          ${isOwner && matches.length > 0 ? `<button class="btn btn-danger btn-sm" style="margin-left:8px" onclick="App.deleteLeague('${leagueId}')">${icon('trash', 14)} Delete League</button>` : ''}
        </div>` : ''}
      </div>
    </div>`;
  },

  addTeam(e, leagueId) {
    e.preventDefault();
    const input = document.getElementById('new-team-input');
    const name = input.value.trim();
    if (!name) return;
    DB.addTeam(name, leagueId);
    showToast('Team added!', 'success');
    this.render();
  },

  removeTeam(teamId) {
    DB.removeTeam(teamId);
    showToast('Team removed.', 'success');
    this.render();
  },

  genFixtures(leagueId) {
    const teams = DB.getLeagueTeams(leagueId);
    if (teams.length < 2) { showToast('Need at least 2 teams.', 'error'); return; }
    const fixtures = generateFixtures(teams, leagueId);
    DB.saveLeagueMatches(leagueId, fixtures);
    showToast('Fixtures generated!', 'success');
    this.currentTab = 'fixtures';
    this.render();
  },

  deleteLeague(leagueId) {
    if (!confirm('Delete this league and all its data?')) return;
    DB.deleteLeague(leagueId);
    showToast('League deleted.', 'success');
    this.navigate('dashboard');
  },

  /* ===== PROFILE ===== */
  renderProfile() {
    const user = DB.currentUser();
    if (!user) { this.navigate('landing'); return ''; }
    const leagues = DB.getUserLeagues(user.id);
    const totalTeams = leagues.reduce((s, l) => s + DB.getLeagueTeams(l.id).length, 0);
    const totalMatches = leagues.reduce((s, l) => s + DB.getLeagueMatches(l.id).filter(m => m.played).length, 0);

    return `
      ${this.renderNavbar(true)}
      <div class="container" style="padding:40px 20px 60px;max-width:800px">
        <div class="card anim-fade">
          <div class="card-body">
            <div class="profile-header">
              <div class="profile-avatar">${user.name[0].toUpperCase()}</div>
              <div class="profile-info">
                <h2>${user.name}</h2>
                <p>${icon('mail', 14)} ${user.email}</p>
                <p style="font-size:.82rem;color:var(--gray-300)">${icon('clock', 14)} Joined ${new Date(user.createdAt).toLocaleDateString()}</p>
                <div class="profile-stats mt-1">
                  <div class="profile-stat"><div class="val">${leagues.length}</div><div class="lbl">Leagues</div></div>
                  <div class="profile-stat"><div class="val">${totalTeams}</div><div class="lbl">Teams</div></div>
                  <div class="profile-stat"><div class="val">${totalMatches}</div><div class="lbl">Matches</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <h3 class="mt-4 mb-2" style="font-size:1.2rem">Account Settings</h3>
        <div class="card anim-fade" style="animation-delay:.1s">
          <div class="card-body">
            <form onsubmit="App.updateProfile(event)">
              <div class="form-group">
                <label class="form-label">Display Name</label>
                <input class="form-input" id="profile-name" value="${user.name}" maxlength="50">
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input class="form-input" value="${user.email}" disabled style="opacity:.6">
                <div class="form-hint">Email cannot be changed.</div>
              </div>
              <button class="btn btn-primary" type="submit">Save Changes</button>
            </form>
          </div>
        </div>

        <h3 class="mt-4 mb-2" style="font-size:1.2rem">Recent Activity</h3>
        <div class="card anim-fade" style="animation-delay:.2s">
          <div class="card-body">
            ${leagues.length === 0 ? '<p style="color:var(--gray-300)">No activity yet. Create a league to get started!</p>' :
              leagues.slice(0, 5).map(l => {
                const m = DB.getLeagueMatches(l.id);
                const played = m.filter(x => x.played).length;
                return `<div class="activity-item">
                  <div class="activity-dot"></div>
                  <div>
                    <div class="activity-text"><strong>${l.name}</strong> — ${DB.getLeagueTeams(l.id).length} teams, ${played}/${m.length} matches played</div>
                    <div class="activity-time">Created ${new Date(l.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>`;
              }).join('')}
          </div>
        </div>

        <div class="mt-4">
          <button class="btn btn-danger" onclick="if(confirm('Log out?')){DB.logout();App.navigate('landing')}">${icon('logout', 16)} Log Out</button>
        </div>
      </div>
      ${this.renderFooter()}
    `;
  },

  updateProfile(e) {
    e.preventDefault();
    const name = document.getElementById('profile-name').value.trim();
    if (!name) return;
    const users = DB.getUsers();
    const u = users.find(x => x.id === DB.currentUser().id);
    if (u) { u.name = name; DB.saveUsers(users); }
    showToast('Profile updated!', 'success');
    this.render();
  },

  bindEvents() { /* placeholder for future event delegation */ }
};

// Boot
document.addEventListener('DOMContentLoaded', () => App.init());
