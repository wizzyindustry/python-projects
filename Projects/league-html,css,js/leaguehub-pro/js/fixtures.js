/* ===== FIXTURES & TABLE LOGIC ===== */
function generateFixtures(teams, leagueId) {
  const names = teams.map(t => t.name);
  const list = [...names];
  if (list.length % 2 !== 0) list.push('BYE');
  const totalRounds = list.length - 1;
  const half = list.length / 2;
  const fixtures = [];

  for (let r = 0; r < totalRounds; r++) {
    for (let m = 0; m < half; m++) {
      const home = list[m], away = list[list.length - 1 - m];
      if (home === 'BYE' || away === 'BYE') continue;
      fixtures.push({
        id: crypto.randomUUID(), leagueId, round: r + 1,
        homeTeam: home, awayTeam: away,
        homeScore: null, awayScore: null, played: false
      });
    }
    list.splice(1, 0, list.pop());
  }
  return fixtures;
}

function calculateTable(teams, matches) {
  const t = {};
  teams.forEach(tm => {
    t[tm.name] = { team: tm.name, played: 0, wins: 0, draws: 0, losses: 0, gf: 0, ga: 0, gd: 0, pts: 0, form: [] };
  });
  matches.filter(m => m.played).forEach(m => {
    const h = t[m.homeTeam], a = t[m.awayTeam];
    if (!h || !a) return;
    h.played++; a.played++;
    h.gf += m.homeScore; h.ga += m.awayScore;
    a.gf += m.awayScore; a.ga += m.homeScore;
    if (m.homeScore > m.awayScore) { h.wins++; h.pts += 3; a.losses++; h.form.push('W'); a.form.push('L'); }
    else if (m.homeScore < m.awayScore) { a.wins++; a.pts += 3; h.losses++; a.form.push('W'); h.form.push('L'); }
    else { h.draws++; h.pts++; a.draws++; a.pts++; h.form.push('D'); a.form.push('D'); }
  });
  return Object.values(t).map(e => ({ ...e, gd: e.gf - e.ga, form: e.form.slice(-5) }))
    .sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
}
