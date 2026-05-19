import { Injectable, inject, signal } from '@angular/core';
import type { Player, Game, Score } from '../../core/models/types';
import type { GameLeaderboard, OverallRank, PlayerRank } from '../../core/models/leaderboard.model';
import { PlayerService } from '../players/player.service';
import { GameService } from '../games/game.service';
import { ScoreService } from '../scores/score.service';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly playerService = inject(PlayerService);
  private readonly gameService = inject(GameService);
  private readonly scoreService = inject(ScoreService);

  private readonly _gameLeaderboards = signal<GameLeaderboard[]>([]);
  private readonly _overallRanking = signal<OverallRank[]>([]);

  readonly gameLeaderboards = this._gameLeaderboards.asReadonly();
  readonly overallRanking = this._overallRanking.asReadonly();

  async load(): Promise<void> {
    await Promise.all([this.playerService.load(), this.gameService.load()]);
    const allScores = await this.scoreService.loadAllForLeaderboard();
    const players = this.playerService.players();
    const games = this.gameService.games();

    const gameLeaderboards = this.computeGameLeaderboards(players, games, allScores);
    this._gameLeaderboards.set(gameLeaderboards);
    this._overallRanking.set(this.computeOverallRanking(players, gameLeaderboards));
  }

  private computeGameLeaderboards(
    players: Player[],
    games: Game[],
    scores: Score[],
  ): GameLeaderboard[] {
    return games.map((game) => {
      const gameScores = scores.filter((s) => s.game_id === game.id);

      const playerBestMap = new Map<string, number>();
      for (const score of gameScores) {
        const existing = playerBestMap.get(score.player_id);
        if (existing === undefined) {
          playerBestMap.set(score.player_id, score.value);
        } else {
          playerBestMap.set(
            score.player_id,
            game.higher_is_better
              ? Math.max(existing, score.value)
              : Math.min(existing, score.value),
          );
        }
      }

      const sorted = [...playerBestMap.entries()]
        .map(([player_id, best_value]) => ({
          player: players.find((p) => p.id === player_id)!,
          best_value,
        }))
        .filter((e) => e.player != null)
        .sort((a, b) =>
          game.higher_is_better ? b.best_value - a.best_value : a.best_value - b.best_value,
        );

      const totalPlayers = sorted.length;
      const rankings: PlayerRank[] = [];
      let rank = 1;
      for (let i = 0; i < sorted.length; i++) {
        if (i > 0 && sorted[i].best_value !== sorted[i - 1].best_value) rank = i + 1;
        rankings.push({
          player: sorted[i].player,
          best_value: sorted[i].best_value,
          rank,
          points: totalPlayers - rank + 1,
        });
      }

      return { game, rankings };
    });
  }

  private computeOverallRanking(
    players: Player[],
    gameLeaderboards: GameLeaderboard[],
  ): OverallRank[] {
    const map = new Map<
      string,
      { player: Player; total: number; game_points: Record<string, number> }
    >();
    for (const player of players) {
      map.set(player.id, { player, total: 0, game_points: {} });
    }

    for (const board of gameLeaderboards) {
      for (const ranking of board.rankings) {
        const entry = map.get(ranking.player.id);
        if (entry) {
          entry.total += ranking.points;
          entry.game_points[board.game.id] = ranking.points;
        }
      }
    }

    const sorted = [...map.values()].sort((a, b) => b.total - a.total);

    let rank = 1;
    return sorted.map((entry, i) => {
      if (i > 0 && sorted[i].total !== sorted[i - 1].total) rank = i + 1;
      return {
        player: entry.player,
        total_points: entry.total,
        rank,
        game_points: entry.game_points,
      };
    });
  }
}
