const League = {
  all(){ return Store.get(KEYS.LEAGUES, []); },
  mine(uid){ return this.all().filter(l => l.ownerId === uid); },
  get(id){ return this.all().find(l => l.id === id); },
  create(name, ownerId){
    const leagues = this.all();
    const league = { id: uid(), name, ownerId, created: Date.now(), banner:'⚽' };
    leagues.push(league); Store.set(KEYS.LEAGUES, leagues); return league;
  },
  update(id, patch){
    const leagues = this.all();
    const i = leagues.findIndex(l=>l.id===id);
    if(i>-1){ leagues[i]={...leagues[i],...patch}; Store.set(KEYS.LEAGUES, leagues); }
  },
  remove(id){
    Store.set(KEYS.LEAGUES, this.all().filter(l=>l.id!==id));
    Store.set(KEYS.TEAMS, Teams.all().filter(t=>t.leagueId!==id));
    Store.set(KEYS.MATCHES, Matches.all().filter(m=>m.leagueId!==id));
  },
};
const Teams = {
  all(){ return Store.get(KEYS.TEAMS, []); },
  byLeague(lid){ return this.all().filter(t => t.leagueId === lid); },
  get(id){ return this.all().find(t=>t.id===id); },
  add(leagueId, name, icon=null){
    const teams = this.all();
    const team = { id: uid(), leagueId, name, icon: icon || this.randomIcon(), created: Date.now() };
    teams.push(team); Store.set(KEYS.TEAMS, teams); return team;
  },
  update(id, patch){
    const teams = this.all();
    const i = teams.findIndex(t=>t.id===id);
    if(i>-1){ teams[i]={...teams[i],...patch}; Store.set(KEYS.TEAMS, teams); }
  },
  remove(id){ Store.set(KEYS.TEAMS, this.all().filter(t=>t.id!==id)); },
  randomIcon(){
    const icons = ['⚽','🦁','🐯','🦅','🐺','🐉','⚡','🔥','⭐','🛡️','🦈','🐂','🦊','🦏'];
    return icons[Math.floor(Math.random()*icons.length)];
  }
};
const Matches = {
  all(){ return Store.get(KEYS.MATCHES, []); },
  byLeague(lid){ return this.all().filter(m => m.leagueId === lid); },
  saveAll(matches, leagueId){
    const others = this.all().filter(m => m.leagueId !== leagueId);
    Store.set(KEYS.MATCHES, [...others, ...matches]);
  },
  update(id, patch){
    const all = this.all();
    const i = all.findIndex(m=>m.id===id);
    if(i>-1){ all[i]={...all[i],...patch}; Store.set(KEYS.MATCHES, all); }
  },
  clearLeague(lid){ Store.set(KEYS.MATCHES, this.all().filter(m=>m.leagueId!==lid)); }
};
const Invites = {
  all(){ return Store.get(KEYS.INVITES, []); },
  create(leagueId){
    const invites = this.all();
    const code = uid().slice(0,8).toUpperCase();
    const invite = { id: uid(), leagueId, code, created: Date.now() };
    invites.push(invite); Store.set(KEYS.INVITES, invites); return invite;
  },
  byLeague(lid){ return this.all().filter(i=>i.leagueId===lid); },
  byCode(code){ return this.all().find(i=>i.code===code); }
};
