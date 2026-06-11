import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SpButton } from '../button/button';
import { ConfirmService } from './confirm.service';

/** Modal confirm card rendered over a scrim inside the phone frame. */
@Component({
  selector: 'sp-confirm-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SpButton],
  template: `
    @if (confirmService.request(); as request) {
      <div
        class="absolute inset-0 z-50 flex items-center justify-center bg-[rgba(16,18,19,.4)] p-6"
        (click)="confirmService.resolve(false)"
      >
        <div
          class="w-full rounded-(--r-xl) bg-(--surface-card) p-5 shadow-(--shadow-lg) [animation:sp-pop_.3s_var(--ease-spring)]"
          role="alertdialog"
          aria-modal="true"
          (click)="$event.stopPropagation()"
        >
          <h2 class="font-display text-[19px] font-bold tracking-(--ls-tight) text-(--text-strong)">
            {{ request.title }}
          </h2>
          <p class="mt-2 mb-5 text-[13.5px] leading-relaxed text-(--text-body)">
            {{ request.message }}
          </p>
          <div class="flex gap-2.5">
            <sp-button variant="secondary" size="md" (pressed)="confirmService.resolve(false)">
              {{ request.cancelLabel }}
            </sp-button>
            <sp-button
              [variant]="request.danger ? 'accent' : 'primary'"
              size="md"
              [block]="true"
              (pressed)="confirmService.resolve(true)"
            >
              {{ request.confirmLabel }}
            </sp-button>
          </div>
        </div>
      </div>
    }
  `,
})
export class SpConfirmDialog {
  protected readonly confirmService = inject(ConfirmService);
}
