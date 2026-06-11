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
import { CategoryService } from './category.service';
import { PlayerService } from '../players/player.service';
import { ToastService } from '../../ui/toast/toast.service';
import { ConfirmService } from '../../ui/confirm-dialog/confirm.service';
import { SpButton } from '../../ui/button/button';
import type { Category } from '../../core/models/types';
import {
  LucideCalendarDays,
  LucideCheck,
  LucideChevronLeft,
  LucidePencil,
  LucidePlus,
  LucideTrash2,
} from '../../ui/icons';

interface CategoryDraft {
  id?: string;
  name: string;
  years: number[];
}

@Component({
  selector: 'app-categories',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    TranslocoPipe,
    SpButton,
    LucideCalendarDays,
    LucideCheck,
    LucideChevronLeft,
    LucidePencil,
    LucidePlus,
    LucideTrash2,
  ],
  templateUrl: './categories.html',
})
export class CategoriesPage implements OnInit {
  protected readonly categoryService = inject(CategoryService);
  private readonly playerService = inject(PlayerService);
  private readonly toast = inject(ToastService);
  private readonly confirmService = inject(ConfirmService);
  private readonly transloco = inject(TranslocoService);

  protected readonly view = signal<'list' | 'form'>('list');
  protected readonly draft = signal<CategoryDraft>({ name: '', years: [] });

  /** Selectable birth years, newest first (design: 2026 → 2008). */
  protected readonly yearChoices = Array.from({ length: 19 }, (_, i) => 2026 - i);

  protected readonly selectedYearsText = computed(() => {
    const years = [...this.draft().years].sort((a, b) => b - a);
    return years.length
      ? years.join(' · ')
      : this.transloco.translate('categories.form.noneSelected');
  });

  ngOnInit(): void {
    void this.categoryService.load();
    void this.playerService.load();
  }

  protected memberCount(category: Category): number {
    return this.playerService.players().filter((p) => category.years.includes(p.year_of_birth))
      .length;
  }

  protected yearsText(category: Category): string {
    return [...category.years].sort((a, b) => b - a).join(' · ');
  }

  protected newCategory(): void {
    this.draft.set({ name: '', years: [] });
    this.view.set('form');
  }

  protected editCategory(category: Category): void {
    this.draft.set({ id: category.id, name: category.name, years: [...category.years] });
    this.view.set('form');
  }

  protected setName(value: string): void {
    this.draft.update((d) => ({ ...d, name: value }));
  }

  protected toggleYear(year: number): void {
    this.draft.update((d) => ({
      ...d,
      years: d.years.includes(year) ? d.years.filter((y) => y !== year) : [...d.years, year],
    }));
  }

  protected cancel(): void {
    this.view.set('list');
  }

  protected async save(): Promise<void> {
    const draft = this.draft();
    const name = draft.name.trim();
    if (!name) {
      this.toast.show(this.transloco.translate('categories.toasts.nameRequired'), 'x');
      return;
    }
    if (!draft.years.length) {
      this.toast.show(this.transloco.translate('categories.toasts.yearsRequired'), 'x');
      return;
    }
    const years = [...draft.years].sort((a, b) => b - a);
    if (draft.id) {
      await this.categoryService.update(draft.id, { name, years });
      this.toast.show(this.transloco.translate('categories.toasts.updated'));
    } else {
      await this.categoryService.create({ name, years });
      this.toast.show(this.transloco.translate('categories.toasts.created'));
    }
    this.view.set('list');
  }

  protected async deleteCategory(category: Category): Promise<void> {
    const confirmed = await this.confirmService.confirm({
      title: this.transloco.translate('categories.confirmDelete.title'),
      message: this.transloco.translate('categories.confirmDelete.message', {
        name: category.name,
      }),
      confirmLabel: this.transloco.translate('categories.confirmDelete.confirm'),
      cancelLabel: this.transloco.translate('common.cancel'),
      danger: true,
    });
    if (!confirmed) return;
    await this.categoryService.remove(category.id);
    this.toast.show(this.transloco.translate('categories.toasts.deleted'), 'trash-2');
  }
}
