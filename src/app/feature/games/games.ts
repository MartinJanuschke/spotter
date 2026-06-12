import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import QRCode from 'qrcode';
import { GameService } from './game.service';
import { ToastService } from '../../ui/toast/toast.service';
import { ConfirmService } from '../../ui/confirm-dialog/confirm.service';
import { SpButton } from '../../ui/button/button';
import {
  SpSegmentedControl,
  type SegmentOption,
} from '../../ui/segmented-control/segmented-control';
import type { Game } from '../../core/models/types';
import {
  LucideCheck,
  LucideChevronLeft,
  LucideFlagTriangleRight,
  LucidePencil,
  LucidePlus,
  LucidePrinter,
  LucideQrCode,
  LucideTarget,
  LucideTrash2,
  LucideTrendingDown,
  LucideTrendingUp,
  LucideX,
} from '../../ui/icons';

interface GameDraft {
  id?: string;
  name: string;
  unit: string;
  dir: 'high' | 'low';
  tries: number;
}

@Component({
  selector: 'app-games',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoPipe,
    SpButton,
    SpSegmentedControl,
    LucideCheck,
    LucideChevronLeft,
    LucideFlagTriangleRight,
    LucidePencil,
    LucidePlus,
    LucidePrinter,
    LucideQrCode,
    LucideTarget,
    LucideTrash2,
    LucideTrendingDown,
    LucideTrendingUp,
    LucideX,
  ],
  templateUrl: './games.html',
})
export class GamesPage implements OnInit {
  protected readonly gameService = inject(GameService);
  private readonly toast = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly transloco = inject(TranslocoService);

  protected readonly view = signal<'list' | 'form'>('list');
  protected readonly draft = signal<GameDraft>({ name: '', unit: '', dir: 'high', tries: 3 });
  protected readonly qrGame = signal<Game | null>(null);
  protected readonly qrDataUrl = signal<string>('');

  protected readonly dirOptions: SegmentOption[] = [
    { label: 'games.form.higherIsBetter', value: 'high' },
    { label: 'games.form.lowerIsBetter', value: 'low' },
  ];

  ngOnInit(): void {
    void this.gameService.load();
  }

  protected newGame(): void {
    this.draft.set({ name: '', unit: '', dir: 'high', tries: 3 });
    this.view.set('form');
  }

  protected editGame(game: Game): void {
    this.draft.set({
      id: game.id,
      name: game.name,
      unit: game.unit,
      dir: game.higher_is_better ? 'high' : 'low',
      tries: game.tries,
    });
    this.view.set('form');
  }

  protected setName(value: string): void {
    this.draft.update((d) => ({ ...d, name: value }));
  }

  protected setUnit(value: string): void {
    this.draft.update((d) => ({ ...d, unit: value }));
  }

  protected setDir(value: string): void {
    this.draft.update((d) => ({ ...d, dir: value as 'high' | 'low' }));
  }

  protected stepTries(delta: number): void {
    this.draft.update((d) => ({ ...d, tries: Math.max(1, Math.min(10, d.tries + delta)) }));
  }

  protected cancel(): void {
    this.view.set('list');
  }

  protected async save(): Promise<void> {
    const draft = this.draft();
    const name = draft.name.trim();
    const unit = draft.unit.trim();
    if (name.length < 2) {
      this.toast.show(this.transloco.translate('games.toasts.nameRequired'), 'x');
      return;
    }
    if (!unit) {
      this.toast.show(this.transloco.translate('games.toasts.unitRequired'), 'x');
      return;
    }
    const data = {
      name,
      unit,
      higher_is_better: draft.dir === 'high',
      tries: draft.tries,
    };
    if (draft.id) {
      await this.gameService.update(draft.id, data);
      this.toast.show(this.transloco.translate('games.toasts.updated'));
    } else {
      await this.gameService.create(data);
      this.toast.show(this.transloco.translate('games.toasts.created'));
    }
    this.view.set('list');
  }

  protected async deleteGame(game: Game): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: this.transloco.translate('games.confirmDelete.title'),
      message: this.transloco.translate('games.confirmDelete.message', { name: game.name }),
      confirmLabel: this.transloco.translate('games.confirmDelete.confirm'),
      cancelLabel: this.transloco.translate('common.cancel'),
      danger: true,
    });
    if (!confirmed) return;
    await this.gameService.remove(game.id);
    this.toast.show(this.transloco.translate('games.toasts.deleted'), 'trash-2');
  }

  protected async showQr(game: Game): Promise<void> {
    const dataUrl = await QRCode.toDataURL(game.id, { width: 640, margin: 2 });
    this.qrDataUrl.set(dataUrl);
    this.qrGame.set(game);
  }

  protected closeQr(): void {
    this.qrGame.set(null);
    this.qrDataUrl.set('');
  }

  protected print(): void {
    window.print();
  }
}
