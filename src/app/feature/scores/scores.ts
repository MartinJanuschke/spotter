import { Component, OnInit, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { PlayerService } from '../players/player.service';
import { GameService } from '../games/game.service';
import { ScoreService } from './score.service';

@Component({
  selector: 'app-scores',
  standalone: true,
  imports: [FormsModule, TranslocoPipe],
  templateUrl: './scores.html',
})
export class ScoresPage implements OnInit {
  private readonly playerService = inject(PlayerService);
  private readonly gameService = inject(GameService);
  private readonly scoreService = inject(ScoreService);

  protected readonly players = this.playerService.players;
  protected readonly games = this.gameService.games;
  protected readonly attempts = this.scoreService.scoresForContext;

  protected readonly selectedPlayerId = signal<string>('');
  protected readonly selectedGameId = signal<string>('');
  protected readonly newValue = signal<string>('');
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly currentGame = computed(() =>
    this.games().find((g) => g.id === this.selectedGameId()),
  );

  protected readonly bestValue = computed(() => {
    const game = this.currentGame();
    const list = this.attempts();
    if (!game || list.length === 0) return null;
    return game.higher_is_better
      ? Math.max(...list.map((a) => a.value))
      : Math.min(...list.map((a) => a.value));
  });

  constructor() {
    effect(() => {
      const pid = this.selectedPlayerId();
      const gid = this.selectedGameId();
      if (pid && gid) {
        this.scoreService.loadForPlayerGame(pid, gid);
      }
    });
  }

  async ngOnInit(): Promise<void> {
    await Promise.all([this.playerService.load(), this.gameService.load()]);
  }

  async onAddAttempt(): Promise<void> {
    const pid = this.selectedPlayerId();
    const gid = this.selectedGameId();
    const val = parseFloat(this.newValue());
    if (!pid || !gid || isNaN(val)) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.scoreService.addAttempt(pid, gid, val);
      this.newValue.set('');
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  async onDeleteAttempt(scoreId: string): Promise<void> {
    const pid = this.selectedPlayerId();
    const gid = this.selectedGameId();
    if (!pid || !gid) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.scoreService.remove(scoreId, pid, gid);
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }
}
