import { Injectable, signal } from '@angular/core';
import { supabase } from '../../core/supabase/supabase.client';
import type { Player, PlayerInsert, PlayerUpdate } from '../../core/models/types';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private readonly _players = signal<Player[]>([]);
  readonly players = this._players.asReadonly();

  async load(): Promise<void> {
    const { data, error } = await supabase.from('players').select('*').order('name');
    if (error) throw error;
    this._players.set(data);
  }

  async findByBadge(badgeCode: string): Promise<Player | null> {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('badge_code', badgeCode)
      .maybeSingle();
    if (error) throw error;
    return data;
  }

  async create(data: PlayerInsert): Promise<void> {
    const { error } = await supabase.from('players').insert(data);
    if (error) throw error;
    await this.load();
  }

  async update(id: string, data: PlayerUpdate): Promise<void> {
    const { error } = await supabase.from('players').update(data).eq('id', id);
    if (error) throw error;
    await this.load();
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('players').delete().eq('id', id);
    if (error) throw error;
    await this.load();
  }
}
