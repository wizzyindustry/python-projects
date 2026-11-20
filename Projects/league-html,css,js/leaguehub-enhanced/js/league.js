
const LeagueStore = {
  LEAGUES_KEY: "leaguehub_leagues",
  TEAMS_KEY: "leaguehub_teams",
  MATCHES_KEY: "leaguehub_matches",

  _get(key) { return JSON.parse(localStorage.getItem(key) || "[]"); },
  _set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },

  getLeagues(userId) { return this._get(this.LEAGUES_KEY).filter(l => l.ownerId === userId); },
  getAllLeagues() { return this._get(this.LEAGUES_KEY); },
  getLeague(id) { return this._get(this.LEAGUES_KEY).find(l => l.id === id); },
  createLeague(name, userId) {
    const leagues = this._get(this.LEAGUES_KEY);
    const league = { id: crypto.randomUUID(), name, ownerId: userId, createdAt: new Date().toISOString() };
    leagues.push(league);
    this._set(this.LEAGUES_KEY, leagues);
    return league;
  },
  deleteLeague(id) {
    this._set(this.LEAGUES_KEY, this._get(this.LEAGUES_KEY).filter(l => l.id !== id));
    this._set(this.TEAMS_KEY, this._get(this.TEAMS_KEY).filter(t => t.leagueId !== id));
    this._set(this.MATCHES_KEY, this._get(this.MATCHES_KEY).filter(m => m.leagueId !== id));
  },

  getTeams(leagueId) { return this._get(this.TEAMS_KEY).filter(t => t.leagueId === leagueId); },
  addTeam(name, leagueId) {
    const teams = this._get(this.TEAMS_KEY);
    const team = { id: crypto.randomUUID(), name, leagueId, createdAt: new Date().toISOString() };
    teams.push(team);
    this._set(this.TEAMS_KEY, teams);
    return team;
  },
  removeTeam(teamId) {
    this._set(this.TEAMS_KEY, this._get(this.TEAMS_KEY).filter(t => t.id !== teamId));
  },

  getMatches(leagueId) { return this._get(this.MATCHES_KEY).filter(m => m.leagueId === leagueId); },
  saveFixtures(leagueId, fixtures) {
    let matches = this._get(this.MATCHES_KEY).filter(m => m.leagueId !== leagueId);
    matches.push(...fixtures.map(f => ({ ...f, leagueId })));
    this._set(this.MATCHES_KEY, matches);
  },
  updateMatch(matchId, homeScore, awayScore) {
    const matches = this._get(this.MATCHES_KEY);
    const m = matches.find(x => x.id === matchId);
    if (m) { m.homeScore = homeScore; m.awayScore = awayScore; m.played = true; }
    this._set(this.MATCHES_KEY, matches);
  }
};
