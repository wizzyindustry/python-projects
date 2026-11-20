/* ===== DATA LAYER (localStorage) ===== */
const DB = {
  _get(key) { try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; } },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  // Users
  getUsers() { return this._get('lh_users') || []; },
  saveUsers(u) { this._set('lh_users', u); },
  createUser(email, password, name) {
    const users = this.getUsers();
    if (users.find(u => u.email === email)) return null;
    const user = { id: crypto.randomUUID(), email, password, name, createdAt: new Date().toISOString() };
    users.push(user);
    this.saveUsers(users);
    return user;
  },
  login(email, password) {
    const user = this.getUsers().find(u => u.email === email && u.password === password);
    if (user) { this._set('lh_session', user.id); return user; }
    return null;
  },
  logout() { localStorage.removeItem('lh_session'); },
  currentUser() {
    const sid = this._get('lh_session');
    if (!sid) return null;
    return this.getUsers().find(u => u.id === sid) || null;
  },

  // Leagues
  getLeagues() { return this._get('lh_leagues') || []; },
  saveLeagues(l) { this._set('lh_leagues', l); },
  createLeague(name, ownerId) {
    const leagues = this.getLeagues();
    const league = { id: crypto.randomUUID(), name, ownerId, createdAt: new Date().toISOString() };
    leagues.push(league);
    this.saveLeagues(leagues);
    return league;
  },
  deleteLeague(id) {
    this.saveLeagues(this.getLeagues().filter(l => l.id !== id));
    this.saveTeams(this.getTeams().filter(t => t.leagueId !== id));
    this.saveMatches(this.getMatches().filter(m => m.leagueId !== id));
  },
  getLeague(id) { return this.getLeagues().find(l => l.id === id) || null; },
  getUserLeagues(userId) { return this.getLeagues().filter(l => l.ownerId === userId); },

  // Teams
  getTeams() { return this._get('lh_teams') || []; },
  saveTeams(t) { this._set('lh_teams', t); },
  addTeam(name, leagueId) {
    const teams = this.getTeams();
    const team = { id: crypto.randomUUID(), name, leagueId, createdAt: new Date().toISOString() };
    teams.push(team);
    this.saveTeams(teams);
    return team;
  },
  removeTeam(id) { this.saveTeams(this.getTeams().filter(t => t.id !== id)); },
  getLeagueTeams(leagueId) { return this.getTeams().filter(t => t.leagueId === leagueId); },

  // Matches
  getMatches() { return this._get('lh_matches') || []; },
  saveMatches(m) { this._set('lh_matches', m); },
  getLeagueMatches(leagueId) { return this.getMatches().filter(m => m.leagueId === leagueId).sort((a,b) => a.round - b.round); },
  saveLeagueMatches(leagueId, newMatches) {
    const others = this.getMatches().filter(m => m.leagueId !== leagueId);
    this.saveMatches([...others, ...newMatches]);
  },
  updateMatch(matchId, homeScore, awayScore) {
    const matches = this.getMatches();
    const m = matches.find(x => x.id === matchId);
    if (m) { m.homeScore = homeScore; m.awayScore = awayScore; m.played = true; }
    this.saveMatches(matches);
  }
};
