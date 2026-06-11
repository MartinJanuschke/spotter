import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PlayerService } from './player.service';
import { CategoryService } from '../categories/category.service';
import { ScoreService } from '../station/score.service';
import { PinService } from '../../core/auth/pin.service';
import { ToastService } from '../../ui/toast/toast.service';
import { ConfirmService } from '../../ui/confirm-dialog/confirm.service';
import { SpButton } from '../../ui/button/button';
import { SpQrScanner } from '../../ui/scanner/qr-scanner';
import { initials } from '../../core/util/format';
import {
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideQrCode,
  LucideTrash2,
} from '../../ui/icons';

interface PlayerDraft {
  id?: string;
  badge: string;
  name: string;
  year: string;
}

@Component({
  selector: 'app-players',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoPipe,
    SpButton,
    SpQrScanner,
    LucideCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucideQrCode,
    LucideTrash2,
  ],
  templateUrl: './players.html',
})
export class PlayersPage implements OnInit {
  protected readonly playerService = inject(PlayerService);
  protected readonly categoryService = inject(CategoryService);
  protected readonly scoreService = inject(ScoreService);
  protected readonly pinService = inject(PinService);
  private readonly toast = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly transloco = inject(TranslocoService);

  protected readonly view = signal<'list' | 'scan' | 'form'>('list');
  protected readonly draft = signal<PlayerDraft>({ badge: '', name: '', year: '' });

  protected readonly initials = initials;

  async ngOnInit(): Promise<void> {
    // The route is public; only operators get the full roster view.
    await this.pinService.restore();
    if (this.pinService.unlocked()) {
      void this.playerService.load();
      void this.categoryService.load();
      void this.scoreService.loadAll();
    }
  }

  protected startScan(): void {
    this.view.set('scan');
  }

  protected async onBadgeDetected(code: string): Promise<void> {
    const existing = await this.playerService.findByBadge(code);
    if (!existing) {
      this.draft.set({ badge: code, name: '', year: '' });
      this.view.set('form');
      return;
    }
    if (this.pinService.unlocked()) {
      this.draft.set({
        id: existing.id,
        badge: existing.badge_code,
        name: existing.name,
        year: String(existing.year_of_birth),
      });
      this.view.set('form');
    } else {
      this.toast.show(
        this.transloco.translate('players.toasts.alreadyRegistered', { name: existing.name }),
      );
      this.view.set('list');
    }
  }

  protected simulateBadge(): void {
    void this.onBadgeDetected(`SP-${Math.floor(1500 + Math.random() * 8000)}`);
  }

  protected editPlayer(id: string): void {
    const player = this.playerService.players().find((p) => p.id === id);
    if (!player) return;
    this.draft.set({
      id: player.id,
      badge: player.badge_code,
      name: player.name,
      year: String(player.year_of_birth),
    });
    this.view.set('form');
  }

  protected setName(value: string): void {
    this.draft.update((d) => ({ ...d, name: value }));
  }

  protected setYear(value: string): void {
    this.draft.update((d) => ({ ...d, year: value.replace(/[^0-9]/g, '').slice(0, 4) }));
  }

  protected cancel(): void {
    this.view.set('list');
  }

  protected async save(): Promise<void> {
    const draft = this.draft();
    const name = draft.name.trim();
    const year = parseInt(draft.year, 10);
    if (name.length < 2) {
      this.toast.show(this.transloco.translate('players.toasts.nameRequired'), 'x');
      return;
    }
    if (!year || year < 2008 || year > 2022) {
      this.toast.show(this.transloco.translate('players.toasts.yearInvalid'), 'x');
      return;
    }
    if (draft.id) {
      await this.playerService.update(draft.id, { name, year_of_birth: year });
      this.toast.show(this.transloco.translate('players.toasts.updated'));
    } else {
      await this.playerService.create({ name, year_of_birth: year, badge_code: draft.badge });
      this.toast.show(this.transloco.translate('players.toasts.created'));
    }
    this.view.set('list');
  }

  protected async deletePlayer(): Promise<void> {
    const draft = this.draft();
    if (!draft.id) return;
    const confirmed = await this.confirmService.confirm({
      title: this.transloco.translate('players.confirmDelete.title'),
      message: this.transloco.translate('players.confirmDelete.message', { name: draft.name }),
      confirmLabel: this.transloco.translate('players.confirmDelete.confirm'),
      cancelLabel: this.transloco.translate('common.cancel'),
      danger: true,
    });
    if (!confirmed) return;
    await this.playerService.remove(draft.id);
    this.toast.show(this.transloco.translate('players.toasts.deleted'), 'trash-2');
    this.view.set('list');
  }
}
