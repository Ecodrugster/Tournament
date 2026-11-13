import { teamsMap } from '../data/teams-map.js';

export function roundNumber(round) {
  const match = String(round || '').match(/\d+/);
  return match ? Number(match[0]) : null;
}

export function matchResult(match, team) {
  const ft = match?.score?.ft;
  if (!Array.isArray(ft) || ft.length < 2 || ft.some((goal) => !Number.isFinite(Number(goal)))) return null;
  const home = Number(ft[0]);
  const away = Number(ft[1]);
  const homeResult = home > away ? 'W' : home < away ? 'L' : 'D';
  if (team === match.team1) return homeResult;
  if (team === match.team2) return homeResult === 'W' ? 'L' : homeResult === 'L' ? 'W' : 'D';
  return null;
}

export function compareRows(a, b) {
  return b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor || a.team.localeCompare(b.team);
}

export function buildTable(matches = []) {
  const rows = new Map();
  const ensure = (team) => {
    if (!rows.has(team)) rows.set(team, { team, played: 0, won: 0, drawn: 0, lost: 0, goalsFor: 0, goalsAgainst: 0, points: 0, form: [] });
    return rows.get(team);
  };
  for (const match of matches) {
    const ft = match?.score?.ft;
    if (!Array.isArray(ft) || ft.length < 2 || !match.team1 || !match.team2 || ft.some((goal) => !Number.isFinite(Number(goal)))) continue;
    const [homeGoals, awayGoals] = ft.map(Number);
    const home = ensure(match.team1);
    const away = ensure(match.team2);
    home.played++; away.played++;
    home.goalsFor += homeGoals; home.goalsAgainst += awayGoals;
    away.goalsFor += awayGoals; away.goalsAgainst += homeGoals;
    if (homeGoals > awayGoals) { home.won++; home.points += 3; away.lost++; }
    else if (homeGoals < awayGoals) { away.won++; away.points += 3; home.lost++; }
    else { home.drawn++; away.drawn++; home.points++; away.points++; }
    home.form.push({ date: match.date || '', result: homeGoals > awayGoals ? 'W' : homeGoals < awayGoals ? 'L' : 'D' });
    away.form.push({ date: match.date || '', result: awayGoals > homeGoals ? 'W' : awayGoals < homeGoals ? 'L' : 'D' });
  }
  return [...rows.values()].map((row) => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst, form: row.form.sort((a, b) => a.date.localeCompare(b.date)).slice(-5).map((item) => item.result).join('') })).sort(compareRows);
}

export function tableAfterRound(matches, round) {
  return buildTable((matches || []).filter((match) => {
    const number = roundNumber(match.round);
    return number !== null && number <= Number(round);
  }));
}

export function teamMatches(matches, team) {
  return (matches || []).filter((match) => match.team1 === team || match.team2 === team).sort((a, b) => (a.date || '').localeCompare(b.date || ''));
}

export function teamForm(matches, team) {
  return teamMatches(matches, team).filter((match) => matchResult(match, team)).slice(-5).map((match) => matchResult(match, team)).join('');
}

export function teamIdByName(name) { return teamsMap[name] ?? null; }

export function clubSummary(matches, team, table) {
  const played = teamMatches(matches, team).filter((match) => matchResult(match, team));
  const home = played.filter((match) => match.team1 === team);
  const away = played.filter((match) => match.team2 === team);
  const largest = played.map((match) => {
    const homeTeam = match.team1 === team;
    const scored = Number(match.score.ft[homeTeam ? 0 : 1]);
    const conceded = Number(match.score.ft[homeTeam ? 1 : 0]);
    return { match, scored, conceded, margin: scored - conceded };
  }).filter((item) => item.margin > 0).sort((a, b) => b.margin - a.margin || b.scored - a.scored)[0];
  return { rank: table.findIndex((row) => row.team === team) + 1, played: played.length, home: buildTable(home)[0], away: buildTable(away)[0], largest };
}
