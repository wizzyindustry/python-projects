def generate_fixtures(teams):
    names = list(teams)
    if len(names) % 2 != 0:
        names.append(None)
    n = len(names)
    fixtures = []
    for r in range(n - 1):
        for i in range(n // 2):
            home, away = names[i], names[n - 1 - i]
            if home is None or away is None:
                continue
            fixtures.append((r + 1, home, away))
        names.insert(1, names.pop())
    return fixtures

def calculate_table(teams, matches):
    table = {}
    for t in teams:
        table[t.id] = {"team": t.name, "played": 0, "wins": 0, "draws": 0,
                        "losses": 0, "gf": 0, "ga": 0, "gd": 0, "points": 0}
    for m in matches:
        if not m.played:
            continue
        h, a = table.get(m.home_team_id), table.get(m.away_team_id)
        if not h or not a:
            continue
        h["played"] += 1; a["played"] += 1
        h["gf"] += m.home_score; h["ga"] += m.away_score
        a["gf"] += m.away_score; a["ga"] += m.home_score
        if m.home_score > m.away_score:
            h["wins"] += 1; h["points"] += 3; a["losses"] += 1
        elif m.home_score < m.away_score:
            a["wins"] += 1; a["points"] += 3; h["losses"] += 1
        else:
            h["draws"] += 1; h["points"] += 1; a["draws"] += 1; a["points"] += 1
    for v in table.values():
        v["gd"] = v["gf"] - v["ga"]
    return sorted(table.values(), key=lambda x: (-x["points"], -x["gd"], -x["gf"]))
