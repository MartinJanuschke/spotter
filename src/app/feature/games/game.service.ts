import { Injectable, signal } from '@angular/core';
import { supabase } from '../../core/supabase/supabase.client';
import type { Game, GameInsert, GameUpdate } from '../../core/models/types';

@Injectable({ providedIn: 'root' })
export class GameService {
  private readonly _games = signal<Game[]>([]);
  readonly games = this._games.asReadonly();

  async load(): Promise<void> {
    const { data, error } = await supabase.from('games').select('*').order('name');
    if (error) throw error;
    this._games.set(data);
  }

  async create(data: GameInsert): Promise<void> {
    const { error } = await supabase.from('games').insert(data);
    if (error) throw error;
    await this.load();
  }

  async update(id: string, data: GameUpdate): Promise<void> {
    const { error } = await supabase.from('games').update(data).eq('id', id);
    if (error) throw error;
    await this.load();
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('games').delete().eq('id', id);
    if (error) throw error;
    await this.load();
  }
}
