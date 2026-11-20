export interface Team {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  round: number;
  homeTeam: string;
  awayTeam: string;
  homeScore: number | null;
  awayScore: number | null;
  played: boolean;
}

export interface TableEntry {
  team: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export function generateFixtures(teams: Team[]): Match[] {
  const teamNames = teams.map(t => t.name);
  const n = teamNames.length;
  const list = [...teamNames];
  
  // If odd number of teams, add a "BYE"
  if (n % 2 !== 0) list.push("BYE");
  
  const totalRounds = list.length - 1;
  const matchesPerRound = list.length / 2;
  const fixtures: Match[] = [];
  let id = 0;

  for (let round = 0; round < totalRounds; round++) {
    for (let match = 0; match < matchesPerRound; match++) {
      const home = list[match];
      const away = list[list.length - 1 - match];
      if (home === "BYE" || away === "BYE") continue;
      
      fixtures.push({
        id: `match-${id++}`,
        round: round + 1,
        homeTeam: home,
        awayTeam: away,
        homeScore: null,
        awayScore: null,
        played: false,
      });
    }
    // Rotate: fix first element, rotate rest
    list.splice(1, 0, list.pop()!);
  }

  return fixtures;
}

export function calculateTable(teams: Team[], matches: Match[]): TableEntry[] {
  const table: Record<string, TableEntry> = {};
  
  teams.forEach(t => {
    table[t.name] = {
      team: t.name,
      played: 0, wins: 0, draws: 0, losses: 0,
      goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0,
    };
  });

  matches.filter(m => m.played).forEach(m => {
    const home = table[m.homeTeam];
    const away = table[m.awayTeam];
    if (!home || !away) return;

    home.played++;
    away.played++;
    home.goalsFor += m.homeScore!;
    home.goalsAgainst += m.awayScore!;
    away.goalsFor += m.awayScore!;
    away.goalsAgainst += m.homeScore!;

    if (m.homeScore! > m.awayScore!) {
      home.wins++; home.points += 3;
      away.losses++;
    } else if (m.homeScore! < m.awayScore!) {
      away.wins++; away.points += 3;
      home.losses++;
    } else {
      home.draws++; home.points += 1;
      away.draws++; away.points += 1;
    }
  });

  Object.values(table).forEach(t => {
    t.goalDifference = t.goalsFor - t.goalsAgainst;
  });

  return Object.values(table).sort((a, b) =>
    b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor
  );
}
