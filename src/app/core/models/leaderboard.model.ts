import type { Player, Game } from './types';

export type LeaderboardMode = 'single' | 'overall';

/** Single-game mode: a player's best raw value for the selected game. */
export interface SingleResult {
  player: Player;
  value: number;
}

/** Overall mode: best normalized result (0–1000) and the game that produced it. */
export interface OverallResult {
  player: Player;
  points: number;
  game: Game;
}
