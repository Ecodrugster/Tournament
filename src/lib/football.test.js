import { describe, expect, it } from 'vitest';
import { buildTable, compareRows, matchResult, roundNumber, tableAfterRound, teamForm, teamIdByName } from './football.js';
import { isFresh } from '../api/sportsdb.js';

const match = (team1, team2, goals, round = 'Matchday 1', date = '2024-08-01') => ({ team1, team2, score: goals === null ? undefined : { ft: goals }, round, date });
describe('football calculations', () => {
  it('returns the result for each side and ignores unfinished matches', () => {
    const game = match('A', 'B', [2, 1]);
    expect(matchResult(game, 'A')).toBe('W'); expect(matchResult(game, 'B')).toBe('L'); expect(matchResult(match('A', 'B', null), 'A')).toBeNull();
  });
  it('builds rows from played games and sorts by points, goal difference, goals and name', () => {
    const table = buildTable([match('A', 'B', [2, 0]), match('B', 'C', [1, 1]), match('C', 'A', [0, 3]), match('D', 'E', null)]);
    expect(table.map(({ team }) => team)).toEqual(['A', 'B', 'C']);
    expect(table[0]).toMatchObject({ points: 6, goalsFor: 5, goalsAgainst: 0, goalDifference: 5, played: 2 });
    expect(compareRows({ points: 3, goalDifference: 3, goalsFor: 5, team: 'B' }, { points: 3, goalDifference: 2, goalsFor: 8, team: 'A' })).toBeLessThan(0);
    expect(compareRows({ points: 1, goalDifference: 0, goalsFor: 2, team: 'A' }, { points: 1, goalDifference: 0, goalsFor: 2, team: 'B' })).toBeLessThan(0);
  });
  it('parses rounds, filters after a round and computes the last five results', () => {
    const games = [match('A', 'B', [1, 0], 'Matchday 1', '2024-08-01'), match('A', 'C', [1, 1], 'Matchday 2', '2024-08-08'), match('D', 'A', [0, 2], 'Matchday 3', '2024-08-15')];
    expect(roundNumber('Matchday 12')).toBe(12); expect(tableAfterRound(games, 1)[0].played).toBe(1); expect(teamForm(games, 'A')).toBe('WDW');
  });
  it('maps known clubs and handles 24 hour cache freshness', () => {
    expect(teamIdByName('Arsenal FC')).toBe(133604); expect(teamIdByName('Unknown FC')).toBeNull();
    const now = Date.now(); expect(isFresh(now - 23 * 60 * 60 * 1000)).toBe(true); expect(isFresh(now - 25 * 60 * 60 * 1000)).toBe(false);
  });
});
