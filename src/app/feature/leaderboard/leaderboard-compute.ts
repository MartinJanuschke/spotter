import type { Game, Player, Score } from '../../core/models/types';
import type { OverallResult, SingleResult } from '../../core/models/leaderboard.model';

/** Best value per player for one game, direction-aware. */
export function bestValuesForGame(game: Game, scores: Score[]): Map<string, number> {
  const best = new Map<string, number>();
  for (const score of scores) {
    if (score.game_id !== game.id) continue;
    const existing = best.get(score.player_id);
    if (existing === undefined) {
      best.set(score.player_id, score.value);
    } else {
      best.set(
        score.player_id,
        game.higher_is_better ? Math.max(existing, score.value) : Math.min(existing, score.value),
      );
    }
  }
  return best;
}

/** Single-game ranking: players sorted by best raw value (direction-aware). */
export function computeSingleResults(
  game: Game,
  players: Player[],
  scores: Score[],
): SingleResult[] {
  const best = bestValuesForGame(game, scores);
  return players
    .filter((p) => best.has(p.id))
    .map((p) => ({ player: p, value: best.get(p.id)! }))
    .sort((a, b) => (game.higher_is_better ? b.value - a.value : a.value - b.value));
}

/**
 * Overall ranking: per game each player's best value is normalized to 0–1000
 * against the field leader (high → v/extreme, low → extreme/v); a player's
 * overall score is their single best normalized result across all games.
 */
export function computeOverallResults(
  games: Game[],
  players: Player[],
  scores: Score[],
): OverallResult[] {
  const bestByPlayer = new Map<string, { points: number; game: Game }>();
  for (const game of games) {
    const best = bestValuesForGame(game, scores);
    const values = [...best.values()];
    if (values.length === 0) continue;
    const extreme = game.higher_is_better ? Math.max(...values) : Math.min(...values);
    for (const [playerId, value] of best) {
      const points =
        value === extreme
          ? 1000
          : game.higher_is_better
            ? (value / extreme) * 1000
            : (extreme / value) * 1000;
      const current = bestByPlayer.get(playerId);
      if (!current || points > current.points) bestByPlayer.set(playerId, { points, game });
    }
  }
  return players
    .filter((p) => bestByPlayer.has(p.id))
    .map((p) => ({ player: p, ...bestByPlayer.get(p.id)! }))
    .sort((a, b) => b.points - a.points);
}
