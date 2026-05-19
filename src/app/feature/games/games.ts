import { Component, OnInit, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { GameService } from './game.service';
import type { Game } from '../../core/models/types';

@Component({
  selector: 'app-games',
  standalone: true,
  imports: [ReactiveFormsModule, TranslocoPipe],
  templateUrl: './games.html',
})
export class GamesPage implements OnInit {
  private readonly gameService = inject(GameService);
  private readonly fb = inject(FormBuilder);
  private readonly t = inject(TranslocoService);

  protected readonly games = this.gameService.games;
  protected readonly editingId = signal<string | null>(null);
  protected readonly showAddForm = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    higher_is_better: [true],
  });

  async ngOnInit(): Promise<void> {
    await this.gameService.load();
  }

  onEdit(game: Game): void {
    this.editingId.set(game.id);
    this.showAddForm.set(false);
    this.form.setValue({ name: game.name, higher_is_better: game.higher_is_better });
  }

  onCancelEdit(): void {
    this.editingId.set(null);
    this.form.reset({ higher_is_better: true });
  }

  onAddNew(): void {
    this.editingId.set(null);
    this.form.reset({ higher_is_better: true });
    this.showAddForm.set(true);
  }

  onCancelAdd(): void {
    this.showAddForm.set(false);
    this.form.reset({ higher_is_better: true });
  }

  async onSave(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.error.set(null);
    const val = this.form.getRawValue() as { name: string; higher_is_better: boolean };
    try {
      const id = this.editingId();
      if (id) {
        await this.gameService.update(id, val);
        this.editingId.set(null);
      } else {
        await this.gameService.create(val);
        this.showAddForm.set(false);
      }
      this.form.reset({ higher_is_better: true });
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }

  async onDelete(id: string): Promise<void> {
    if (!confirm(this.t.translate('games.confirmDelete'))) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.gameService.remove(id);
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
    } finally {
      this.loading.set(false);
    }
  }
}
