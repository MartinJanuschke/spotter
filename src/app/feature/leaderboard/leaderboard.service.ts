import { Injectable, computed, inject, signal } from '@angular/core';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../core/supabase/supabase.client';
import type { Score } from '../../core/models/types';
import type {
  LeaderboardMode,
  OverallResult,
  SingleResult,
} from '../../core/models/leaderboard.model';
import { PlayerService } from '../players/player.service';
import { GameService } from '../games/game.service';
import { CategoryService } from '../categories/category.service';
import { computeOverallResults, computeSingleResults } from './leaderboard-compute';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private readonly playerService = inject(PlayerService);
  private readonly gameService = inject(GameService);
  private readonly categoryService = inject(CategoryService);

  private readonly _scores = signal<Score[]>([]);

  readonly mode = signal<LeaderboardMode>('single');
  readonly selectedGameId = signal<string | null>(null);
  readonly selectedCategoryId = signal<string>('all');

  private channel: RealtimeChannel | null = null;
  private reloadTimer: ReturnType<typeof setTimeout> | null = null;

  /** Ranked rows for the current mode, before category filtering. */
  private readonly singleResults = computed<SingleResult[]>(() => {
    const game = this.gameService.games().find((g) => g.id === this.selectedGameId());
    if (!game) return [];
    return computeSingleResults(game, this.playerService.players(), this._scores());
  });

  private readonly overallResults = computed<OverallResult[]>(() =>
    computeOverallResults(this.gameService.games(), this.playerService.players(), this._scores()),
  );

  /** Category-filtered single-game rows (normalization still uses the full field). */
  readonly filteredSingle = computed(() =>
    this.singleResults().filter((r) => this.inCategory(r.player.year_of_birth)),
  );

  readonly filteredOverall = computed(() =>
    this.overallResults().filter((r) => this.inCategory(r.player.year_of_birth)),
  );

  readonly selectedGame = computed(() =>
    this.gameService.games().find((g) => g.id === this.selectedGameId()),
  );

  private inCategory(year: number): boolean {
    const id = this.selectedCategoryId();
    if (id === 'all') return true;
    const category = this.categoryService.categories().find((c) => c.id === id);
    return category ? category.years.includes(year) : true;
  }

  async load(): Promise<void> {
    await Promise.all([
      this.playerService.load(),
      this.gameService.load(),
      this.categoryService.load(),
      this.loadScores(),
    ]);
    if (this.selectedGameId() === null) {
      this.selectedGameId.set(this.gameService.games()[0]?.id ?? null);
    }
  }

  private async loadScores(): Promise<void> {
    const { data, error } = await supabase.from('scores').select('*');
    if (error) throw error;
    this._scores.set(data);
  }

  subscribeRealtime(): void {
    if (this.channel) return;
    this.channel = supabase.channel('leaderboard-live');
    for (const table of ['scores', 'players', 'games', 'categories']) {
      this.channel.on('postgres_changes', { event: '*', schema: 'public', table }, () =>
        this.scheduleReload(),
      );
    }
    this.channel.subscribe();
  }

  unsubscribeRealtime(): void {
    if (this.reloadTimer) clearTimeout(this.reloadTimer);
    this.reloadTimer = null;
    if (this.channel) {
      void supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }

  /** Debounce: a station saving several attempts fires change events in bursts. */
  private scheduleReload(): void {
    if (this.reloadTimer) clearTimeout(this.reloadTimer);
    this.reloadTimer = setTimeout(() => {
      this.reloadTimer = null;
      void this.load();
    }, 300);
  }
}
