import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
} from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LeaderboardService } from './leaderboard.service';
import { GameService } from '../games/game.service';
import { CategoryService } from '../categories/category.service';
import {
  SpSegmentedControl,
  type SegmentOption,
} from '../../ui/segmented-control/segmented-control';
import { fmt, initials } from '../../core/util/format';
import type { LeaderboardMode } from '../../core/models/leaderboard.model';

interface DisplayRow {
  rank: number;
  initials: string;
  name: string;
  sub: string;
  valueText: string;
  unitText: string;
}

@Component({
  selector: 'app-leaderboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, SpSegmentedControl],
  templateUrl: './leaderboard.html',
})
export class LeaderboardPage implements OnInit {
  protected readonly leaderboardService = inject(LeaderboardService);
  protected readonly gameService = inject(GameService);
  protected readonly categoryService = inject(CategoryService);
  private readonly transloco = inject(TranslocoService);

  protected readonly modeOptions: SegmentOption[] = [
    { label: 'leaderboard.modeSingle', value: 'single' },
    { label: 'leaderboard.modeOverall', value: 'overall' },
  ];

  protected readonly rows = computed<DisplayRow[]>(() => {
    if (this.leaderboardService.mode() === 'single') {
      const unit = this.leaderboardService.selectedGame()?.unit ?? '';
      return this.leaderboardService.filteredSingle().map((r, i) => ({
        rank: i + 1,
        initials: initials(r.player.name),
        name: r.player.name,
        sub: this.categoryService.labelForYear(r.player.year_of_birth),
        valueText: fmt(r.value),
        unitText: unit,
      }));
    }
    return this.leaderboardService.filteredOverall().map((r, i) => ({
      rank: i + 1,
      initials: initials(r.player.name),
      name: r.player.name,
      sub: this.transloco.translate('leaderboard.bestOf', { game: r.game.name }),
      valueText: String(Math.round(r.points)),
      unitText: this.transloco.translate('leaderboard.pointsUnit'),
    }));
  });

  constructor() {
    inject(DestroyRef).onDestroy(() => this.leaderboardService.unsubscribeRealtime());
  }

  ngOnInit(): void {
    void this.leaderboardService.load();
    this.leaderboardService.subscribeRealtime();
  }

  protected setMode(value: string): void {
    this.leaderboardService.mode.set(value as LeaderboardMode);
  }

  protected rankClass(rank: number): string {
    if (rank === 1) return 'bg-(--tier-gold) text-white';
    if (rank === 2) return 'bg-(--tier-silver) text-white';
    if (rank === 3) return 'bg-(--tier-bronze) text-white';
    return 'bg-(--surface-sunken) text-(--text-muted)';
  }
}
