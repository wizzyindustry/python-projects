// Local persistent storage wrapper
const Store = {
  get(k, d = null){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; }catch{return d;} },
  set(k, v){ localStorage.setItem(k, JSON.stringify(v)); },
  del(k){ localStorage.removeItem(k); },
};
const KEYS = {
  USERS:'lh_users', SESSION:'lh_session', PENDING:'lh_pending',
  LEAGUES:'lh_leagues', TEAMS:'lh_teams', MATCHES:'lh_matches', INVITES:'lh_invites'
};
const uid = () => Math.random().toString(36).slice(2,11) + Date.now().toString(36);
