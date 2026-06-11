import { describe, expect, it } from 'vitest';
import {
  bestValuesForGame,
  computeOverallResults,
  computeSingleResults,
} from './leaderboard-compute';
import type { Game, Player, Score } from '../../core/models/types';

function player(id: string, year = 2016): Player {
  return {
    id,
    name: `Player ${id}`,
    badge_code: `SP-${id}`,
    year_of_birth: year,
    created_at: '',
    updated_at: '',
  };
}

function game(id: string, higherIsBetter: boolean): Game {
  return {
    id,
    name: `Game ${id}`,
    higher_is_better: higherIsBetter,
    unit: higherIsBetter ? 'km/h' : 's',
    tries: 3,
    created_at: '',
    updated_at: '',
  };
}

function score(gameId: string, playerId: string, value: number, attempt = 1): Score {
  return {
    id: `${gameId}-${playerId}-${attempt}`,
    game_id: gameId,
    player_id: playerId,
    value,
    attempt_number: attempt,
    created_at: '',
  };
}

describe('bestValuesForGame', () => {
  it('keeps the highest value when higher is better', () => {
    const g = game('g1', true);
    const best = bestValuesForGame(g, [score('g1', 'p1', 50), score('g1', 'p1', 70, 2)]);
    expect(best.get('p1')).toBe(70);
  });

  it('keeps the lowest value when lower is better', () => {
    const g = game('g1', false);
    const best = bestValuesForGame(g, [score('g1', 'p1', 14), score('g1', 'p1', 12.5, 2)]);
    expect(best.get('p1')).toBe(12.5);
  });

  it('ignores scores of other games', () => {
    const g = game('g1', true);
    const best = bestValuesForGame(g, [score('g2', 'p1', 99)]);
    expect(best.size).toBe(0);
  });
});

describe('computeSingleResults', () => {
  const players = [player('p1'), player('p2'), player('p3')];

  it('sorts descending when higher is better', () => {
    const g = game('g1', true);
    const rows = computeSingleResults(g, players, [
      score('g1', 'p1', 60),
      score('g1', 'p2', 80),
      score('g1', 'p3', 70),
    ]);
    expect(rows.map((r) => r.player.id)).toEqual(['p2', 'p3', 'p1']);
  });

  it('sorts ascending when lower is better', () => {
    const g = game('g1', false);
    const rows = computeSingleResults(g, players, [score('g1', 'p1', 14), score('g1', 'p2', 12)]);
    expect(rows.map((r) => r.player.id)).toEqual(['p2', 'p1']);
    expect(rows[0].value).toBe(12);
  });

  it('omits players without scores', () => {
    const g = game('g1', true);
    const rows = computeSingleResults(g, players, [score('g1', 'p1', 60)]);
    expect(rows).toHaveLength(1);
  });
});

describe('computeOverallResults', () => {
  const players = [player('p1'), player('p2')];

  it('gives the field leader 1000 points (higher is better)', () => {
    const g = game('g1', true);
    const rows = computeOverallResults([g], players, [
      score('g1', 'p1', 80),
      score('g1', 'p2', 40),
    ]);
    expect(rows[0].player.id).toBe('p1');
    expect(rows[0].points).toBe(1000);
    expect(rows[1].points).toBe(500);
  });

  it('normalizes lower-is-better games via extreme/value', () => {
    const g = game('g1', false);
    const rows = computeOverallResults([g], players, [
      score('g1', 'p1', 10),
      score('g1', 'p2', 20),
    ]);
    expect(rows[0].player.id).toBe('p1');
    expect(rows[0].points).toBe(1000);
    expect(rows[1].points).toBe(500);
  });

  it('uses the single best normalized result across games', () => {
    const fast = game('g1', true);
    const slow = game('g2', false);
    const rows = computeOverallResults([fast, slow], players, [
      // p1 mediocre in g1 (500), field leader in g2 (1000)
      score('g1', 'p1', 40),
      score('g1', 'p2', 80),
      score('g2', 'p1', 10),
      score('g2', 'p2', 20),
    ]);
    const p1 = rows.find((r) => r.player.id === 'p1')!;
    expect(p1.points).toBe(1000);
    expect(p1.game.id).toBe('g2');
  });

  it('returns empty when there are no scores', () => {
    expect(computeOverallResults([game('g1', true)], players, [])).toEqual([]);
  });
});
