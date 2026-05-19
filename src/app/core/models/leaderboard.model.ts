import type { Player, Game } from './types';

export interface PlayerRank {
  player: Player;
  best_value: number;
  rank: number;
  points: number;
}

export interface GameLeaderboard {
  game: Game;
  rankings: PlayerRank[];
}

export interface OverallRank {
  player: Player;
  total_points: number;
  rank: number;
  game_points: Record<string, number | undefined>;
}
