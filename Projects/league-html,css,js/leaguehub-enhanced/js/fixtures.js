
function generateFixtures(teams) {
  const list = [...teams];
  if (list.length % 2 !== 0) list.push({ id: "BYE", name: "BYE" });
  const n = list.length;
  const rounds = n - 1;
  const half = n / 2;
  const fixtures = [];
  const teamIdx = list.slice(1);

  for (let r = 0; r < rounds; r++) {
    const roundFixtures = [];
    const home = list[0];
    const away = teamIdx[r % (n - 1)];
    if (home.id !== "BYE" && away.id !== "BYE") {
      roundFixtures.push({ id: crypto.randomUUID(), round: r + 1, homeTeam: home.name, awayTeam: away.name, homeScore: null, awayScore: null, played: false });
    }
    for (let i = 1; i < half; i++) {
      const h = teamIdx[(r + i) % (n - 1)];
      const a = teamIdx[(r + n - 1 - i) % (n - 1)];
      if (h.id !== "BYE" && a.id !== "BYE") {
        roundFixtures.push({ id: crypto.randomUUID(), round: r + 1, homeTeam: h.name, awayTeam: a.name, homeScore: null, awayScore: null, played: false });
      }
    }
    fixtures.push(...roundFixtures);
  }
  return fixtures;
}

function calculateTable(teams, matches) {
  const map = {};
  teams.forEach(t => {
    map[t.name] = { team: t.name, played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0, form: [] };
  });
  matches.filter(m => m.played).forEach(m => {
    const h = map[m.homeTeam], a = map[m.awayTeam];
    if (!h || !a) return;
    h.played++; a.played++;
    h.goalsFor += m.homeScore; h.goalsAgainst += m.awayScore;
    a.goalsFor += m.awayScore; a.goalsAgainst += m.homeScore;
    if (m.homeScore > m.awayScore) { h.wins++; h.points += 3; a.losses++; h.form.push("W"); a.form.push("L"); }
    else if (m.homeScore < m.awayScore) { a.wins++; a.points += 3; h.losses++; h.form.push("L"); a.form.push("W"); }
    else { h.draws++; a.draws++; h.points += 1; a.points += 1; h.form.push("D"); a.form.push("D"); }
  });
  return Object.values(map).map(e => ({ ...e, goalDifference: e.goalsFor - e.goalsAgainst, form: e.form.slice(-5) }))
    .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
}
