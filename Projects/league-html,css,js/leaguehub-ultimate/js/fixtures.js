// Round-robin fixture generator
function generateFixtures(teams){
  const list = teams.map(t => t.id);
  if(list.length % 2 !== 0) list.push(null); // bye
  const n = list.length, rounds = n - 1, half = n/2;
  const fixtures = [];
  let arr = [...list];
  for(let r = 0; r < rounds; r++){
    for(let i = 0; i < half; i++){
      const home = arr[i], away = arr[n-1-i];
      if(home && away){
        fixtures.push({
          id: uid(), round: r+1,
          homeTeamId: r%2===0 ? home : away,
          awayTeamId: r%2===0 ? away : home,
          homeScore:null, awayScore:null, played:false
        });
      }
    }
    arr = [arr[0], ...arr.slice(-1), ...arr.slice(1, -1)];
  }
  return fixtures;
}
function calculateTable(teams, matches){
  const stats = {};
  teams.forEach(t => stats[t.id] = {
    team:t, played:0,wins:0,draws:0,losses:0,gf:0,ga:0,form:[]
  });
  matches.filter(m=>m.played).forEach(m => {
    const h=stats[m.homeTeamId], a=stats[m.awayTeamId];
    if(!h||!a) return;
    h.played++;a.played++;h.gf+=m.homeScore;h.ga+=m.awayScore;
    a.gf+=m.awayScore;a.ga+=m.homeScore;
    if(m.homeScore>m.awayScore){h.wins++;a.losses++;h.form.push('W');a.form.push('L');}
    else if(m.homeScore<m.awayScore){a.wins++;h.losses++;a.form.push('W');h.form.push('L');}
    else{h.draws++;a.draws++;h.form.push('D');a.form.push('D');}
  });
  return Object.values(stats).map(s => ({
    ...s, gd: s.gf - s.ga, points: s.wins*3 + s.draws,
    form: s.form.slice(-5)
  })).sort((a,b) => b.points-a.points || b.gd-a.gd || b.gf-a.gf || a.team.name.localeCompare(b.team.name));
}
