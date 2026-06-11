import { Injectable, signal } from '@angular/core';
import { supabase } from '../../core/supabase/supabase.client';
import type { Category, CategoryInsert, CategoryUpdate } from '../../core/models/types';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly _categories = signal<Category[]>([]);
  readonly categories = this._categories.asReadonly();

  async load(): Promise<void> {
    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) throw error;
    this._categories.set(data);
  }

  /** Category label for a birth year, e.g. "U9/U10" — falls back to "Jg. 2016". */
  labelForYear(year: number): string {
    const category = this._categories().find((c) => c.years.includes(year));
    return category ? category.name : `Jg. ${year}`;
  }

  async create(data: CategoryInsert): Promise<void> {
    const { error } = await supabase.from('categories').insert(data);
    if (error) throw error;
    await this.load();
  }

  async update(id: string, data: CategoryUpdate): Promise<void> {
    const { error } = await supabase.from('categories').update(data).eq('id', id);
    if (error) throw error;
    await this.load();
  }

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
    await this.load();
  }
}
