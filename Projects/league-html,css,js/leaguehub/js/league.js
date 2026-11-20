const LeagueDB = {
  getAll() { return JSON.parse(localStorage.getItem("lh_leagues")||"[]"); },
  save(leagues) { localStorage.setItem("lh_leagues", JSON.stringify(leagues)); },
  getById(id) { return this.getAll().find(l=>l.id===id); },
  create(name,ownerId) {
    const leagues=this.getAll();
    const league={id:crypto.randomUUID(),name,owner_id:ownerId,teams:[],matches:[],created_at:new Date().toISOString()};
    leagues.push(league); this.save(leagues); return league;
  },
  update(league) {
    const leagues=this.getAll(); const i=leagues.findIndex(l=>l.id===league.id);
    if(i>=0){leagues[i]=league; this.save(leagues);}
  },
  delete(id) { this.save(this.getAll().filter(l=>l.id!==id)); },
  addTeam(leagueId,name) {
    const l=this.getById(leagueId); if(!l) return;
    l.teams.push({id:crypto.randomUUID(),name}); this.update(l);
  },
  removeTeam(leagueId,teamId) {
    const l=this.getById(leagueId); if(!l) return;
    l.teams=l.teams.filter(t=>t.id!==teamId); this.update(l);
  }
};