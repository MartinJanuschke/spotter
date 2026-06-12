import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { GameService } from '../games/game.service';
import { PlayerService } from '../players/player.service';
import { CategoryService } from '../categories/category.service';
import { ScoreService } from './score.service';
import { ToastService } from '../../ui/toast/toast.service';
import { ConfirmService } from '../../ui/confirm-dialog/confirm.service';
import { SpButton } from '../../ui/button/button';
import { SpQrScanner } from '../../ui/scanner/qr-scanner';
import { fmt, initials } from '../../core/util/format';
import type { Game, Player } from '../../core/models/types';
import { LucideCheck, LucideRotateCcw, LucideTarget, LucideUserRoundPlus } from '../../ui/icons';

@Component({
  selector: 'app-station',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoPipe,
    SpButton,
    SpQrScanner,
    LucideCheck,
    LucideRotateCcw,
    LucideTarget,
    LucideUserRoundPlus,
  ],
  templateUrl: './station.html',
})
export class StationPage implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly playerService = inject(PlayerService);
  protected readonly categoryService = inject(CategoryService);
  private readonly scoreService = inject(ScoreService);
  private readonly toast = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly transloco = inject(TranslocoService);

  protected readonly step = signal<'scanGame' | 'scanPlayer' | 'entry'>('scanGame');
  protected readonly game = signal<Game | null>(null);
  protected readonly player = signal<Player | null>(null);
  protected readonly valueInput = signal('');
  protected readonly entering = signal(true);

  protected readonly initials = initials;
  protected readonly fmt = fmt;

  protected readonly attempts = computed(() =>
    this.scoreService.scoresForContext().map((s) => s.value),
  );

  protected readonly bestIndex = computed(() => {
    const game = this.game();
    const attempts = this.attempts();
    if (!game || attempts.length === 0) return -1;
    let best = 0;
    for (let i = 1; i < attempts.length; i++) {
      if (game.higher_is_better ? attempts[i] > attempts[best] : attempts[i] < attempts[best]) {
        best = i;
      }
    }
    return best;
  });

  protected readonly bestText = computed(() => {
    const game = this.game();
    const index = this.bestIndex();
    if (!game || index < 0) return '';
    return `${fmt(this.attempts()[index])} ${game.unit}`;
  });

  protected readonly enterLabel = computed(() => {
    const game = this.game();
    const n = this.attempts().length + 1;
    const tries = game?.tries ?? 1;
    return n > tries
      ? this.transloco.translate('station.extraAttempt', { n })
      : this.transloco.translate('station.attemptOf', { n, total: tries });
  });

  ngOnInit(): void {
    void this.categoryService.load();
  }

  // ---- step 1: scan game ----
  protected async onGameDetected(code: string): Promise<void> {
    const game = await this.gameService.findById(code);
    if (!game) {
      this.toast.show(this.transloco.translate('station.toasts.unknownGame'), 'x');
      return;
    }
    this.game.set(game);
    this.player.set(null);
    this.step.set('scanPlayer');
  }

  protected async simulateGame(): Promise<void> {
    await this.gameService.load();
    const games = this.gameService.games();
    if (!games.length) return;
    void this.onGameDetected(games[Math.floor(Math.random() * games.length)].id);
  }

  protected async changeGame(): Promise<void> {
    if (this.step() === 'entry' && this.entering() && this.attempts().length > 0) {
      if (!(await this.confirmSkip())) return;
    }
    this.game.set(null);
    this.player.set(null);
    this.step.set('scanGame');
  }

  // ---- step 2: scan player ----
  protected async onPlayerDetected(code: string): Promise<void> {
    const game = this.game();
    if (!game) return;
    const player = await this.playerService.findByBadge(code);
    if (!player) {
      this.toast.show(this.transloco.translate('station.toasts.unknownBadge'), 'x');
      return;
    }
    await this.scoreService.loadForPlayerGame(player.id, game.id);
    this.player.set(player);
    this.valueInput.set('');
    this.entering.set(this.scoreService.scoresForContext().length < game.tries);
    this.step.set('entry');
  }

  protected async simulatePlayer(): Promise<void> {
    await this.playerService.load();
    const players = this.playerService.players();
    if (!players.length) return;
    void this.onPlayerDetected(players[Math.floor(Math.random() * players.length)].badge_code);
  }

  // ---- step 3: score entry ----
  protected setValue(value: string): void {
    this.valueInput.set(value.replace(/[^0-9.,]/g, '').replace(',', '.'));
  }

  protected async addAttempt(): Promise<void> {
    const game = this.game();
    const player = this.player();
    if (!game || !player) return;
    const value = parseFloat(this.valueInput());
    if (!this.valueInput() || isNaN(value) || value < 0) {
      this.toast.show(this.transloco.translate('station.toasts.invalidValue'), 'x');
      return;
    }
    await this.scoreService.addAttempt(player.id, game.id, Math.round(value * 100) / 100);
    this.valueInput.set('');
    const count = this.attempts().length;
    this.entering.set(count < game.tries);
    this.toast.show(this.transloco.translate('station.toasts.attemptSaved', { n: count }));
  }

  protected anotherAttempt(): void {
    this.valueInput.set('');
    this.entering.set(true);
  }

  protected async skip(): Promise<void> {
    if (this.attempts().length > 0 && this.entering()) {
      if (!(await this.confirmSkip())) return;
    }
    this.nextPlayer();
  }

  protected nextPlayer(): void {
    this.player.set(null);
    this.valueInput.set('');
    this.entering.set(true);
    this.step.set('scanPlayer');
  }

  private confirmSkip(): Promise<boolean> {
    return this.confirmService.confirm({
      title: this.transloco.translate('station.confirmSkip.title'),
      message: this.transloco.translate('station.confirmSkip.message'),
      confirmLabel: this.transloco.translate('station.confirmSkip.confirm'),
      cancelLabel: this.transloco.translate('common.cancel'),
    });
  }
}
