import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PlayerService } from './player.service';
import type { Player } from '../../core/models/types';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe],
  templateUrl: './players.html',
})
export class PlayersPage implements OnInit {
  private readonly playerService = inject(PlayerService);
  private readonly fb = inject(FormBuilder);
  private readonly t = inject(TranslocoService);

  protected readonly players = this.playerService.players;
  protected readonly editingId = signal<string | null>(null);
  protected readonly showAddForm = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    first_name: ['', Validators.required],
    last_name: ['', Validators.required],
    year_of_birth: [
      new Date().getFullYear(),
      [Validators.required, Validators.min(1900), Validators.max(2100)],
    ],
  });

  async ngOnInit(): Promise<void> {
    await this.playerService.load();
  }

  onEdit(player: Player): void {
    this.editingId.set(player.id);
    this.showAddForm.set(false);
    this.form.setValue({
      first_name: player.first_name,
      last_name: player.last_name,
      year_of_birth: player.year_of_birth,
    });
  }

  onCancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ year_of_birth: new Date().getFullYear() });
  }

  onAddNew(): void {
    this.editingId.set(null);
    this.form.reset({ year_of_birth: new Date().getFullYear() });
    this.showAddForm.set(true);
  }

  onCancelAdd(): void {
    this.showAddForm.set(false);
    this.form.reset({ year_of_birth: new Date().getFullYear() });
  }

  async onSave(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const val = this.form.getRawValue() as {
      first_name: string;
      last_name: string;
      year_of_birth: number;
    };
    try {
      const id = this.editingId();
      if (id) {
        await this.playerService.update(id, val);
        this.editingId.set(null);
      } else {
        await this.playerService.create(val);
        this.showAddForm.set(false);
      }
      this.form.reset({ year_of_birth: new Date().getFullYear() });
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  async onDelete(id: string): Promise<void> {
    if (!confirm(this.t.translate('players.confirmDelete'))) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.playerService.remove(id);
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }
}
