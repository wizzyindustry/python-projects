// === Page renderers ===
const App = () => document.getElementById('app');
const initials = name => (name||'U').split(' ').map(p=>p[0]).join('').slice(0,2).toUpperCase();

const Pages = {
  // --- LANDING ---
  landing(){
    const u = Auth.current();
    App().innerHTML = renderNav('home') + `
      <section class="hero">
        <div class="container">
          <div class="hero-badge">⚡ MVP Ready · Trusted by 200+ organizers</div>
          <h1>Run Your League<br/>Like a Pro</h1>
          <p>Create leagues, auto-generate fixtures, track standings live, and share with your community — all in one place. No spreadsheets needed.</p>
          <div class="hero-cta">
            <button class="btn btn-primary btn-lg" onclick="${u?`Router.go('/dashboard')`:`Router.go('/auth')`}">${u?'Go to Dashboard':'Get Started Free'} →</button>
            <button class="btn btn-secondary btn-lg" onclick="document.getElementById('features').scrollIntoView({behavior:'smooth'})">Learn More</button>
          </div>
          <div class="hero-stats">
            <div><div class="hero-stat-num">200+</div><div class="hero-stat-label">Active Organizers</div></div>
            <div><div class="hero-stat-num">1.2k</div><div class="hero-stat-label">Leagues Created</div></div>
            <div><div class="hero-stat-num">50k</div><div class="hero-stat-label">Matches Tracked</div></div>
          </div>
        </div>
      </section>
      <section class="features" id="features">
        <div class="container">
          <h2 class="section-title">Everything you need</h2>
          <p class="section-sub">Powerful features designed for league organizers, simplified for everyone.</p>
          <div class="feature-grid">
            ${[
              ['⚡','Instant Fixtures','Round-robin schedule generated in one click. Every team plays every other team.'],
              ['📊','Live Standings','Tables update automatically with goals, points, form, and rankings.'],
              ['🔗','Shareable Links','Share invite links so others can view or join your league.'],
              ['📸','Export as Image','Download standings and fixtures as beautiful images to share anywhere.'],
              ['🛡️','Team Icons','Personalize each team with custom icons and identity.'],
              ['📱','Mobile First','Works perfectly on any device. Update results from the sideline.']
            ].map(f=>`
              <div class="feature-card">
                <div class="feature-icon">${f[0]}</div>
                <h3>${f[1]}</h3>
                <p>${f[2]}</p>
              </div>`).join('')}
          </div>
        </div>
      </section>
      ${renderFooter()}
    `;
  },

  // --- AUTH ---
  auth(){
    App().innerHTML = renderNav() + `
      <div class="auth-page">
        <div class="auth-visual">
          <div class="auth-visual-content">
            <div class="brand" style="color:#fff"><span class="brand-logo">🏆</span> LeagueHub</div>
            <h2 style="margin-top:48px">Welcome to the future of league management.</h2>
            <p>Join hundreds of organizers running their leagues effortlessly.</p>
          </div>
          <div class="auth-quote">"LeagueHub saved me 5 hours every weekend. It just works." — Marcus, U-15 Coach</div>
        </div>
        <div class="auth-form-side">
          <form class="auth-form fade-in" onsubmit="return Pages.handleSignup(event)">
            <h2>Create your account</h2>
            <p class="sub">Start managing your league in under a minute.</p>
            <div class="form-group">
              <label class="label">Full Name</label>
              <input class="input" name="name" required placeholder="John Doe"/>
            </div>
            <div class="form-group">
              <label class="label">Email</label>
              <input class="input" type="email" name="email" required placeholder="you@example.com"/>
            </div>
            <div class="form-group">
              <label class="label">Password</label>
              <input class="input" type="password" name="password" required minlength="6" placeholder="At least 6 characters"/>
            </div>
            <button class="btn btn-primary btn-block">Create Account →</button>
            <div class="auth-switch">Already have an account? <a onclick="Router.go('/login')">Sign in</a></div>
          </form>
        </div>
      </div>
      ${renderFooter()}
    `;
  },
  handleSignup(e){
    e.preventDefault();
    const f = e.target;
    try{
      Auth.signup(f.name.value.trim(), f.email.value.trim().toLowerCase(), f.password.value);
      Toast.show('Account created! Please sign in to continue.', 'success');
      setTimeout(()=>Router.go('/login'), 600);
    }catch(err){ Toast.show(err.message, 'error'); }
    return false;
  },

  login(){
    const pendingEmail = Store.get(KEYS.PENDING) || '';
    App().innerHTML = renderNav() + `
      <div class="auth-page">
        <div class="auth-visual">
          <div class="auth-visual-content">
            <div class="brand" style="color:#fff"><span class="brand-logo">🏆</span> LeagueHub</div>
            <h2 style="margin-top:48px">Welcome back, organizer.</h2>
            <p>Sign in to continue managing your leagues.</p>
          </div>
          <div class="auth-quote">"Best tool we've used for our school tournaments." — Sarah, P.E. Teacher</div>
        </div>
        <div class="auth-form-side">
          <form class="auth-form fade-in" onsubmit="return Pages.handleLogin(event)">
            <h2>Sign in</h2>
            <p class="sub">${pendingEmail?'Verify by signing in with your new account.':'Welcome back to LeagueHub.'}</p>
            <div class="form-group">
              <label class="label">Email</label>
              <input class="input" type="email" name="email" required value="${pendingEmail}" placeholder="you@example.com"/>
            </div>
            <div class="form-group">
              <label class="label">Password</label>
              <input class="input" type="password" name="password" required placeholder="••••••••"/>
            </div>
            <button class="btn btn-primary btn-block">Sign In →</button>
            <div class="auth-switch">New here? <a onclick="Router.go('/auth')">Create an account</a></div>
          </form>
        </div>
      </div>
      ${renderFooter()}
    `;
  },
  handleLogin(e){
    e.preventDefault();
    const f = e.target;
    try{
      Auth.login(f.email.value.trim().toLowerCase(), f.password.value);
      Toast.show('Welcome back!','success');
      Router.go('/dashboard');
    }catch(err){ Toast.show(err.message,'error'); }
    return false;
  },

  // --- DASHBOARD ---
  dashboard(){
    const u = Auth.fullUser();
    if(!u){ return Router.go('/login'); }
    const leagues = League.mine(u.id);
    const totalTeams = leagues.reduce((s,l)=>s+Teams.byLeague(l.id).length,0);
    const totalMatches = leagues.reduce((s,l)=>s+Matches.byLeague(l.id).length,0);
    const completed = leagues.reduce((s,l)=>{
      const ms = Matches.byLeague(l.id);
      return s + ms.filter(m=>m.played).length;
    },0);

    App().innerHTML = renderNav('dashboard') + `
      <section class="dash-hero">
        <div class="container dash-hero-inner">
          <div>
            <div class="dash-greet">Welcome back,</div>
            <div class="dash-name">${u.name} 👋</div>
          </div>
          <button class="btn btn-primary" onclick="Pages.openCreateLeague()">+ New League</button>
        </div>
      </section>
      <div class="container">
        <div class="stats-grid">
          ${statCard('🏆','blue', leagues.length, 'Total Leagues')}
          ${statCard('👥','teal', totalTeams, 'Total Teams')}
          ${statCard('⚽','gold', totalMatches, 'Fixtures')}
          ${statCard('✅','green', completed, 'Matches Played')}
        </div>
        <h2 style="font-size:22px;margin-bottom:16px">Your Leagues</h2>
        ${leagues.length===0 ? `
          <div class="card empty-state">
            <div class="empty-icon">🏟️</div>
            <h3>No leagues yet</h3>
            <p class="text-muted mt-2">Create your first league and start adding teams in seconds.</p>
            <button class="btn btn-primary mt-6" onclick="Pages.openCreateLeague()">Create Your First League</button>
          </div>
        ` : `
          <div class="leagues-grid">
            ${leagues.map(l => leagueCard(l)).join('')}
          </div>
        `}
      </div>
      ${renderFooter()}
    `;
  },
  openCreateLeague(){
    Modal.show('Create New League', `
      <form onsubmit="return Pages.handleCreateLeague(event)">
        <div class="form-group">
          <label class="label">League Name</label>
          <input class="input" name="name" required maxlength="60" placeholder="Premier Sunday League"/>
        </div>
        <div class="form-group">
          <label class="label">Banner Emoji</label>
          <input class="input" name="banner" maxlength="2" value="⚽" style="font-size:18px"/>
        </div>
        <button class="btn btn-primary btn-block">Create League</button>
      </form>
    `);
  },
  handleCreateLeague(e){
    e.preventDefault();
    const f = e.target;
    const u = Auth.current();
    const l = League.create(f.name.value.trim(), u.id);
    if(f.banner.value) League.update(l.id, {banner: f.banner.value});
    Modal.close();
    Toast.show('League created!','success');
    Router.go('/league/'+l.id);
    return false;
  },

  // --- LEAGUE DETAIL ---
  leagueDetail(id, tab='standings'){
    const u = Auth.current();
    const l = League.get(id);
    if(!l){ Toast.show('League not found','error'); return Router.go('/dashboard'); }
    const isOwner = u && l.ownerId === u.id;
    const teams = Teams.byLeague(id);
    const matches = Matches.byLeague(id);
    const table = calculateTable(teams, matches);
    const rounds = [...new Set(matches.map(m=>m.round))].sort((a,b)=>a-b);

    App().innerHTML = renderNav('dashboard') + `
      <section class="dash-hero" style="padding:40px 0">
        <div class="container dash-hero-inner">
          <div>
            <button class="btn btn-ghost btn-sm" onclick="Router.go('/dashboard')">← Back</button>
            <div class="dash-name" style="font-size:28px;margin-top:8px">${l.banner||'⚽'} ${escapeHtml(l.name)}</div>
            <div class="dash-greet" style="margin-top:6px">${teams.length} teams · ${matches.length} fixtures · ${matches.filter(m=>m.played).length} played</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" onclick="Pages.openShareModal('${id}')">🔗 Share</button>
            ${isOwner ? `<button class="btn btn-secondary btn-sm" onclick="Pages.openInviteModal('${id}')">✉️ Invite</button>` : ''}
          </div>
        </div>
      </section>
      <div class="container" style="padding-top:32px;padding-bottom:32px">
        <div class="tabs">
          <a class="tab ${tab==='standings'?'active':''}" onclick="Pages.leagueDetail('${id}','standings')">📊 Standings</a>
          <a class="tab ${tab==='fixtures'?'active':''}" onclick="Pages.leagueDetail('${id}','fixtures')">⚽ Fixtures</a>
          ${isOwner?`<a class="tab ${tab==='teams'?'active':''}" onclick="Pages.leagueDetail('${id}','teams')">👥 Teams</a>`:''}
        </div>
        ${tab==='standings'?renderStandings(table, l, isOwner):''}
        ${tab==='fixtures'?renderFixtures(matches, teams, rounds, l, isOwner):''}
        ${tab==='teams' && isOwner?renderTeamsTab(teams, matches, id):''}
      </div>
      ${renderFooter()}
    `;
  },

  publicLeague(id){
    const l = League.get(id);
    if(!l){ App().innerHTML = renderNav() + `<div class="container static-page"><h1>League not found</h1><p>This league may have been removed.</p></div>` + renderFooter(); return; }
    history.replaceState({}, '', location.pathname + '#/league/'+id);
    Pages.leagueDetail(id);
  },

  invite(code){
    const inv = Invites.byCode(code);
    if(!inv){ App().innerHTML = renderNav() + `<div class="container static-page"><h1>Invalid invite</h1><p>This invite link is invalid or expired.</p></div>` + renderFooter(); return; }
    const u = Auth.current();
    if(!u){
      App().innerHTML = renderNav() + `
        <div class="verify-page"><div class="card verify-card">
          <div class="verify-icon">✉️</div>
          <h2>You're invited!</h2>
          <p class="text-muted">Sign in or create an account to view this league.</p>
          <div class="flex gap-2 mt-6" style="justify-content:center">
            <button class="btn btn-primary" onclick="Router.go('/login')">Sign In</button>
            <button class="btn btn-secondary" onclick="Router.go('/auth')">Sign Up</button>
          </div>
        </div></div>${renderFooter()}`;
      return;
    }
    history.replaceState({}, '', location.pathname + '#/league/'+inv.leagueId);
    Pages.leagueDetail(inv.leagueId);
    Toast.show('Joined league via invite!','success');
  },

  // --- PROFILE ---
  profile(){
    const u = Auth.fullUser();
    if(!u){ return Router.go('/login'); }
    const leagues = League.mine(u.id);
    App().innerHTML = renderNav('profile') + `
      <div class="container profile-page">
        <div class="profile-header">
          <div class="profile-avatar">
            ${u.avatar ? `<img src="${u.avatar}"/>` : initials(u.name)}
            <label class="avatar-upload-btn" title="Change photo">
              📷
              <input type="file" accept="image/*" hidden onchange="Pages.handleAvatar(event)"/>
            </label>
          </div>
          <div style="flex:1;min-width:200px">
            <h1 style="font-size:28px">${escapeHtml(u.name)}</h1>
            <p class="text-muted">${escapeHtml(u.email)}</p>
            <p class="text-sm text-muted mt-2">Member since ${new Date(u.joined).toLocaleDateString()} · ${leagues.length} leagues</p>
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Profile Settings</div></div>
          <div class="card-body">
            <form onsubmit="return Pages.handleProfileSave(event)">
              <div class="form-group">
                <label class="label">Display Name</label>
                <input class="input" name="name" value="${escapeHtml(u.name)}" required/>
              </div>
              <div class="form-group">
                <label class="label">Email</label>
                <input class="input" type="email" name="email" value="${escapeHtml(u.email)}" required/>
              </div>
              <div class="form-group">
                <label class="label">Bio</label>
                <textarea class="input textarea" name="bio" rows="3" placeholder="Tell others about yourself...">${escapeHtml(u.bio||'')}</textarea>
              </div>
              <div class="flex gap-2">
                <button class="btn btn-primary">Save Changes</button>
                <button type="button" class="btn btn-danger" onclick="Pages.logout()">Sign Out</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      ${renderFooter()}
    `;
  },
  handleAvatar(e){
    const file = e.target.files[0];
    if(!file) return;
    if(file.size > 2*1024*1024){ Toast.show('Image must be under 2MB','error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      Auth.update({avatar: ev.target.result});
      Toast.show('Profile photo updated!','success');
      Pages.profile();
    };
    reader.readAsDataURL(file);
  },
  handleProfileSave(e){
    e.preventDefault();
    const f = e.target;
    Auth.update({name:f.name.value.trim(), email:f.email.value.trim(), bio:f.bio.value.trim()});
    Toast.show('Profile saved!','success');
    Pages.profile();
    return false;
  },
  logout(){ Auth.logout(); Toast.show('Signed out','info'); Router.go('/'); },

  // --- TEAMS / MATCHES handlers ---
  addTeam(leagueId){
    Modal.show('Add Team', `
      <form onsubmit="return Pages.handleAddTeam(event,'${leagueId}')">
        <div class="form-group">
          <label class="label">Team Name</label>
          <input class="input" name="name" required maxlength="40" placeholder="Red Lions FC"/>
        </div>
        <div class="form-group">
          <label class="label">Team Icon (emoji or upload)</label>
          <div class="flex gap-2">
            <input class="input" name="icon" maxlength="2" placeholder="🦁" style="max-width:80px;font-size:18px;text-align:center"/>
            <label class="btn btn-secondary" style="flex:1">
              📷 Upload Logo
              <input type="file" hidden accept="image/*" onchange="Pages.previewTeamIcon(event)"/>
            </label>
          </div>
          <div id="iconPreview" class="mt-2"></div>
        </div>
        <button class="btn btn-primary btn-block">Add Team</button>
      </form>
    `);
  },
  previewTeamIcon(e){
    const file = e.target.files[0]; if(!file) return;
    if(file.size > 500*1024){ Toast.show('Logo must be under 500KB','error'); return; }
    const reader = new FileReader();
    reader.onload = ev => {
      window._pendingIcon = ev.target.result;
      document.getElementById('iconPreview').innerHTML = `<div class="team-icon" style="width:48px;height:48px"><img src="${ev.target.result}"/></div>`;
    };
    reader.readAsDataURL(file);
  },
  handleAddTeam(e, leagueId){
    e.preventDefault();
    const f = e.target;
    const icon = window._pendingIcon || f.icon.value || null;
    Teams.add(leagueId, f.name.value.trim(), icon);
    window._pendingIcon = null;
    Modal.close();
    Toast.show('Team added!','success');
    Pages.leagueDetail(leagueId, 'teams');
    return false;
  },
  editTeamIcon(teamId, leagueId){
    Modal.show('Update Team Icon', `
      <form onsubmit="return Pages.handleUpdateIcon(event,'${teamId}','${leagueId}')">
        <div class="form-group">
          <label class="label">Emoji Icon</label>
          <input class="input" name="icon" maxlength="2" placeholder="🦁" style="font-size:18px;text-align:center"/>
        </div>
        <p class="text-center text-muted">— or —</p>
        <label class="btn btn-secondary btn-block mt-2">
          📷 Upload Custom Logo
          <input type="file" hidden accept="image/*" onchange="Pages.previewTeamIcon(event)"/>
        </label>
        <div id="iconPreview" class="mt-4 text-center"></div>
        <button class="btn btn-primary btn-block mt-4">Save Icon</button>
      </form>
    `);
  },
  handleUpdateIcon(e, teamId, leagueId){
    e.preventDefault();
    const icon = window._pendingIcon || e.target.icon.value;
    if(icon){ Teams.update(teamId, {icon}); }
    window._pendingIcon = null;
    Modal.close();
    Toast.show('Team icon updated!','success');
    Pages.leagueDetail(leagueId, Router.current.includes('fixtures')?'fixtures':'teams');
    return false;
  },
  removeTeam(teamId, leagueId){
    if(!confirm('Remove this team?')) return;
    Teams.remove(teamId);
    Toast.show('Team removed','info');
    Pages.leagueDetail(leagueId,'teams');
  },
  generateFixtures(leagueId){
    const teams = Teams.byLeague(leagueId);
    if(teams.length < 2){ Toast.show('Need at least 2 teams','error'); return; }
    if(Matches.byLeague(leagueId).length && !confirm('This will replace existing fixtures. Continue?')) return;
    const fixtures = generateFixtures(teams).map(f => ({...f, leagueId}));
    Matches.saveAll(fixtures, leagueId);
    Toast.show('Fixtures generated!','success');
    Pages.leagueDetail(leagueId,'fixtures');
  },
  saveScore(matchId, leagueId){
    const row = document.querySelector(`[data-match="${matchId}"]`);
    const h = parseInt(row.querySelector('[data-h]').value);
    const a = parseInt(row.querySelector('[data-a]').value);
    if(isNaN(h)||isNaN(a)||h<0||a<0){ Toast.show('Invalid scores','error'); return; }
    Matches.update(matchId, {homeScore:h, awayScore:a, played:true});
    Toast.show('Score saved!','success');
    Pages.leagueDetail(leagueId,'fixtures');
  },

  openShareModal(leagueId){
    const link = Share.link(leagueId);
    Modal.show('Share League', `
      <p class="text-muted text-sm">Anyone with this link can view the league standings and fixtures.</p>
      <div class="invite-link-box mt-4">
        <input id="shareLink" value="${link}" readonly/>
        <button class="btn btn-primary btn-sm" onclick="Share.copy(document.getElementById('shareLink').value)">Copy</button>
      </div>
      <h4 style="margin-top:24px;font-size:14px">Export as Image</h4>
      <div class="share-options">
        <div class="share-opt" onclick="Pages.exportImage('${leagueId}','standings')">
          <div class="share-opt-icon">📊</div>
          <div class="share-opt-label">Standings Image</div>
        </div>
        <div class="share-opt" onclick="Pages.exportImage('${leagueId}','fixtures')">
          <div class="share-opt-icon">⚽</div>
          <div class="share-opt-label">Fixtures Image</div>
        </div>
        <div class="share-opt" onclick="window.open('https://wa.me/?text=${encodeURIComponent('Check out our league: '+link)}','_blank')">
          <div class="share-opt-icon">💬</div>
          <div class="share-opt-label">WhatsApp</div>
        </div>
        <div class="share-opt" onclick="window.open('https://twitter.com/intent/tweet?text=${encodeURIComponent('Check out our league: '+link)}','_blank')">
          <div class="share-opt-icon">𝕏</div>
          <div class="share-opt-label">Twitter / X</div>
        </div>
      </div>
    `);
  },
  openInviteModal(leagueId){
    const link = Share.invite(leagueId);
    Modal.show('Invite Others', `
      <p class="text-muted text-sm">Send this invitation link to teammates, parents, or other organizers.</p>
      <div class="invite-link-box mt-4">
        <input id="inviteLink" value="${link}" readonly/>
        <button class="btn btn-primary btn-sm" onclick="Share.copy(document.getElementById('inviteLink').value)">Copy</button>
      </div>
      <div class="share-options">
        <div class="share-opt" onclick="window.open('mailto:?subject=${encodeURIComponent('Join my league on LeagueHub')}&body=${encodeURIComponent('Hi! Join my league here: '+link)}','_blank')">
          <div class="share-opt-icon">📧</div>
          <div class="share-opt-label">Email Invite</div>
        </div>
        <div class="share-opt" onclick="window.open('https://wa.me/?text=${encodeURIComponent('Join my league: '+link)}','_blank')">
          <div class="share-opt-icon">💬</div>
          <div class="share-opt-label">WhatsApp</div>
        </div>
      </div>
    `);
  },
  exportImage(leagueId, type){
    Modal.close();
    setTimeout(()=>{
      const id = type==='standings' ? 'export-standings' : 'export-fixtures';
      Share.snapshot(id, `leaguehub-${type}-${Date.now()}.png`);
    }, 300);
  }
};

// --- helpers ---
function statCard(icon, color, value, label){
  return `<div class="stat-card">
    <div class="stat-icon ${color}">${icon}</div>
    <div class="stat-value">${value}</div>
    <div class="stat-label">${label}</div>
  </div>`;
}
function leagueCard(l){
  const teams = Teams.byLeague(l.id);
  const matches = Matches.byLeague(l.id);
  const played = matches.filter(m=>m.played).length;
  const pct = matches.length ? Math.round((played/matches.length)*100) : 0;
  let status = 'Setup', cls='setup';
  if(matches.length && played < matches.length){ status='In Progress'; cls='progress'; }
  if(matches.length && played === matches.length){ status='Complete'; cls='complete'; }
  return `<div class="card league-card fade-in" onclick="Router.go('/league/${l.id}')">
    <div class="league-card-banner">${l.banner||'⚽'}</div>
    <div class="league-card-body">
      <div class="flex justify-between items-center" style="margin-bottom:8px">
        <span class="status-badge status-${cls}">${status}</span>
      </div>
      <h3>${escapeHtml(l.name)}</h3>
      <div class="league-card-meta">
        <span>👥 ${teams.length} teams</span>
        <span>⚽ ${matches.length} fixtures</span>
      </div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="progress-info"><span>${played}/${matches.length} played</span><span>${pct}%</span></div>
    </div>
  </div>`;
}
function teamIconHtml(team){
  if(!team) return '';
  const ic = team.icon || '⚽';
  if(ic.startsWith('data:')) return `<div class="team-icon"><img src="${ic}"/></div>`;
  return `<div class="team-icon">${ic}</div>`;
}
function renderStandings(table, league, isOwner){
  if(!table.length) return `<div class="card empty-state"><div class="empty-icon">📊</div><h3>No standings yet</h3><p class="text-muted mt-2">Add teams and generate fixtures to see the table.</p></div>`;
  return `<div class="card">
    <div class="card-header">
      <div><div class="card-title">League Table</div><div class="card-subtitle">Sorted by points, GD, then goals scored</div></div>
      <button class="btn btn-secondary btn-sm" onclick="Share.snapshot('export-standings','standings.png')">📸 Save as Image</button>
    </div>
    <div id="export-standings" class="snapshot-target">
      <div style="text-align:center;margin-bottom:20px;color:#fff">
        <div style="font-size:14px;opacity:0.7;text-transform:uppercase;letter-spacing:0.1em">${escapeHtml(league.name)}</div>
        <div style="font-size:24px;font-family:'Space Grotesk';font-weight:700">League Standings</div>
      </div>
      <div class="table-wrap">
        <table class="std-table">
          <thead><tr>
            <th>#</th><th style="text-align:left">Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GF</th><th>GA</th><th>GD</th><th>Form</th><th>Pts</th>
          </tr></thead>
          <tbody>
            ${table.map((r,i)=>`<tr>
              <td>${i<3?`<span class="rank-medal rank-${i+1}">${i+1}</span>`:i+1}</td>
              <td><div class="team-cell">${teamIconHtml(r.team)} <span>${escapeHtml(r.team.name)}</span></div></td>
              <td>${r.played}</td><td>${r.wins}</td><td>${r.draws}</td><td>${r.losses}</td>
              <td>${r.gf}</td><td>${r.ga}</td><td>${r.gd>0?'+':''}${r.gd}</td>
              <td>${[0,1,2,3,4].map(idx => `<span class="form-badge form-${r.form[idx]||'N'}">${r.form[idx]||'-'}</span>`).join('')}</td>
              <td><strong>${r.points}</strong></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div style="text-align:center;margin-top:16px;font-size:11px;color:rgba(255,255,255,0.5)">Powered by LeagueHub</div>
    </div>
  </div>`;
}
function renderFixtures(matches, teams, rounds, league, isOwner){
  if(!matches.length){
    return `<div class="card empty-state">
      <div class="empty-icon">⚽</div>
      <h3>No fixtures yet</h3>
      ${isOwner ? `<p class="text-muted mt-2">${teams.length<2?'Add at least 2 teams first.':'Generate the round-robin schedule.'}</p>
        ${teams.length>=2?`<button class="btn btn-primary mt-6" onclick="Pages.generateFixtures('${league.id}')">⚡ Generate Fixtures</button>`:''}` : '<p class="text-muted mt-2">The owner hasn\'t generated fixtures yet.</p>'}
    </div>`;
  }
  const teamMap = Object.fromEntries(teams.map(t=>[t.id,t]));
  return `<div class="card">
    <div class="card-header">
      <div><div class="card-title">All Fixtures</div><div class="card-subtitle">${rounds.length} rounds · ${matches.length} matches</div></div>
      <div class="flex gap-2">
        <button class="btn btn-secondary btn-sm" onclick="Share.snapshot('export-fixtures','fixtures.png')">📸 Save as Image</button>
        ${isOwner?`<button class="btn btn-secondary btn-sm" onclick="Pages.generateFixtures('${league.id}')">🔄 Regenerate</button>`:''}
      </div>
    </div>
    <div class="card-body">
      <div id="export-fixtures" class="snapshot-target">
        <div style="text-align:center;margin-bottom:20px;color:#fff">
          <div style="font-size:14px;opacity:0.7;text-transform:uppercase;letter-spacing:0.1em">${escapeHtml(league.name)}</div>
          <div style="font-size:24px;font-family:'Space Grotesk';font-weight:700">Fixtures & Results</div>
        </div>
        ${rounds.map(r => `
          <div class="card round-card" style="margin-bottom:14px">
            <div class="card-header" style="padding:12px 16px"><div class="card-title" style="font-size:14px">Round ${r}</div></div>
            <div class="card-body" style="padding:12px">
              ${matches.filter(m=>m.round===r).map(m => {
                const home = teamMap[m.homeTeamId], away = teamMap[m.awayTeamId];
                if(!home||!away) return '';
                return `<div class="match-row ${m.played?'match-played':''}" data-match="${m.id}">
                  <div class="match-team home">
                    <span>${escapeHtml(home.name)}</span>
                    ${teamIconHtml(home)}
                    ${isOwner?`<button class="btn btn-ghost btn-sm" style="padding:2px 6px" onclick="event.stopPropagation();Pages.editTeamIcon('${home.id}','${league.id}')" title="Change icon">✏️</button>`:''}
                  </div>
                  <div class="match-score">
                    ${isOwner?`
                      <input class="score-input" data-h type="number" min="0" value="${m.homeScore??''}" placeholder="-"/>
                      <span class="score-sep">:</span>
                      <input class="score-input" data-a type="number" min="0" value="${m.awayScore??''}" placeholder="-"/>
                      <button class="btn btn-primary btn-sm" onclick="Pages.saveScore('${m.id}','${league.id}')">✓</button>
                    `:`
                      <span class="score-display">${m.played?m.homeScore:'-'}</span>
                      <span class="score-sep">:</span>
                      <span class="score-display">${m.played?m.awayScore:'-'}</span>
                    `}
                  </div>
                  <div class="match-team">
                    ${teamIconHtml(away)}
                    ${isOwner?`<button class="btn btn-ghost btn-sm" style="padding:2px 6px" onclick="event.stopPropagation();Pages.editTeamIcon('${away.id}','${league.id}')" title="Change icon">✏️</button>`:''}
                    <span>${escapeHtml(away.name)}</span>
                  </div>
                </div>`;
              }).join('')}
            </div>
          </div>`).join('')}
        <div style="text-align:center;margin-top:8px;font-size:11px;color:rgba(255,255,255,0.5)">Powered by LeagueHub</div>
      </div>
    </div>
  </div>`;
}
function renderTeamsTab(teams, matches, leagueId){
  return `<div class="card">
    <div class="card-header">
      <div><div class="card-title">Teams (${teams.length})</div><div class="card-subtitle">Add teams before generating fixtures</div></div>
      <button class="btn btn-primary btn-sm" onclick="Pages.addTeam('${leagueId}')">+ Add Team</button>
    </div>
    <div class="card-body">
      ${teams.length===0?`<p class="text-muted text-center" style="padding:20px">No teams yet. Add your first team above.</p>`:
        teams.map(t=>`<div class="team-list-item">
          <div class="team-list-info">
            ${teamIconHtml(t)}
            <span style="font-weight:500">${escapeHtml(t.name)}</span>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-ghost btn-sm" onclick="Pages.editTeamIcon('${t.id}','${leagueId}')">🎨 Icon</button>
            ${matches.length===0?`<button class="btn btn-danger btn-sm" onclick="Pages.removeTeam('${t.id}','${leagueId}')">🗑️</button>`:''}
          </div>
        </div>`).join('')
      }
      ${teams.length>=2 ? `<button class="btn btn-primary mt-6" onclick="Pages.generateFixtures('${leagueId}')">⚡ ${matches.length?'Regenerate':'Generate'} Fixtures</button>` : ''}
    </div>
  </div>`;
}

// === Nav + Footer ===
function renderNav(active){
  const u = Auth.fullUser();
  return `<nav class="navbar"><div class="container nav-inner">
    <a class="brand" onclick="Router.go('/')"><span class="brand-logo">🏆</span> LeagueHub</a>
    <div class="nav-links" id="navLinks">
      <a class="nav-link ${active==='home'?'active':''}" onclick="Router.go('/')">Home</a>
      ${u?`<a class="nav-link ${active==='dashboard'?'active':''}" onclick="Router.go('/dashboard')">Dashboard</a>`:''}
      <a class="nav-link" onclick="Router.go('/help')">Help</a>
      <a class="nav-link" onclick="Router.go('/contact')">Contact</a>
    </div>
    <div class="nav-actions">
      ${u?`
        <div class="user-chip" onclick="Router.go('/profile')">
          <div class="user-chip-avatar">${u.avatar?`<img src="${u.avatar}"/>`:initials(u.name)}</div>
          <span class="user-chip-name">${escapeHtml(u.name.split(' ')[0])}</span>
        </div>
      `:`
        <button class="btn btn-ghost btn-sm" onclick="Router.go('/login')">Sign In</button>
        <button class="btn btn-primary btn-sm" onclick="Router.go('/auth')">Get Started</button>
      `}
      <button class="menu-toggle" onclick="document.getElementById('navLinks').classList.toggle('open')">☰</button>
    </div>
  </div></nav>`;
}
function renderFooter(){
  return `<footer class="footer"><div class="container">
    <div class="footer-grid">
      <div>
        <div class="brand footer-brand"><span class="brand-logo">🏆</span> LeagueHub</div>
        <p class="footer-tag">The simplest way to run sports leagues. Built for organizers, loved by communities.</p>
        <div class="footer-social">
          <a title="Twitter" onclick="Toast.show('Follow us @leaguehub','info')">𝕏</a>
          <a title="Facebook" onclick="Toast.show('Like us on Facebook!','info')">f</a>
          <a title="Instagram" onclick="Toast.show('Follow @leaguehub','info')">📷</a>
          <a title="GitHub" onclick="Toast.show('Open source soon!','info')">🐙</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Product</h4>
        <ul>
          <li><a onclick="Router.go('/')">Home</a></li>
          <li><a onclick="Router.go('/dashboard')">Dashboard</a></li>
          <li><a onclick="Router.go('/auth')">Get Started</a></li>
          <li><a onclick="Router.go('/profile')">Profile</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Support</h4>
        <ul>
          <li><a onclick="Router.go('/help')">Help Center</a></li>
          <li><a onclick="Router.go('/contact')">Contact Us</a></li>
          <li><a onclick="Router.go('/faq')">FAQ</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Legal</h4>
        <ul>
          <li><a onclick="Router.go('/privacy')">Privacy Policy</a></li>
          <li><a onclick="Router.go('/terms')">Terms of Service</a></li>
          <li><a onclick="Router.go('/cookies')">Cookies Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© ${new Date().getFullYear()} LeagueHub. All rights reserved.</span>
      <span>Made with ⚽ for the love of the game.</span>
    </div>
  </div></footer>`;
}
function escapeHtml(s){ return String(s||'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
