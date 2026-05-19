import { Injectable, signal } from '@angular/core';
import { supabase } from '../../core/supabase/supabase.client';
import type { Score } from '../../core/models/types';

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly _scoresForContext = signal<Score[]>([]);
  readonly scoresForContext = this._scoresForContext.asReadonly();

  async loadForPlayerGame(playerId: string, gameId: string): Promise<void> {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('player_id', playerId)
      .eq('game_id', gameId)
      .order('attempt_number');
    if (error) throw error;
    this._scoresForContext.set(data);
  }

  async addAttempt(playerId: string, gameId: string, value: number): Promise<void> {
    const existing = this._scoresForContext();
    const nextAttempt =
      existing.length > 0 ? Math.max(...existing.map((s) => s.attempt_number)) + 1 : 1;
    const { error } = await supabase.from('scores').insert({
      player_id: playerId,
      game_id: gameId,
      value,
      attempt_number: nextAttempt,
    });
    if (error) throw error;
    await this.loadForPlayerGame(playerId, gameId);
  }

  async remove(scoreId: string, playerId: string, gameId: string): Promise<void> {
    const { error } = await supabase.from('scores').delete().eq('id', scoreId);
    if (error) throw error;
    await this.loadForPlayerGame(playerId, gameId);
  }

  async loadAllForLeaderboard(): Promise<Score[]> {
    const { data, error } = await supabase.from('scores').select('*');
    if (error) throw error;
    return data;
  }
}
