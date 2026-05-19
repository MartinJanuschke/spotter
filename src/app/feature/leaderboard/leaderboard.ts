import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LeaderboardService } from './leaderboard.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [TranslocoPipe],
  templateUrl: './leaderboard.html',
})
export class LeaderboardPage implements OnInit {
  private readonly leaderboardService = inject(LeaderboardService);

  protected readonly gameLeaderboards = this.leaderboardService.gameLeaderboards;
  protected readonly overallRanking = this.leaderboardService.overallRanking;
  protected readonly activeTab = signal<string>('overall');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.leaderboardService.load();
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  protected rankLabel(rank: number): string {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}.`;
  }
}
