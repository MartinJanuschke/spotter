import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { LucideCheck, LucideTrash2, LucideX } from '../icons';
import { ToastService } from './toast.service';

/** Floating toast pill, positioned above the tab bar inside the phone frame. */
@Component({
  selector: 'sp-toast-host',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCheck, LucideTrash2, LucideX],
  template: `
    @if (toastService.toast(); as toast) {
      <div
        class="absolute bottom-[92px] left-1/2 z-40 inline-flex -translate-x-1/2 items-center gap-2 rounded-(--r-pill) bg-(--ink-900) px-4 py-[11px] font-body text-[13.5px] font-semibold whitespace-nowrap text-white shadow-(--shadow-lg) [animation:sp-toast_.28s_var(--ease-out)]"
        role="status"
      >
        <span class="inline-flex text-(--live-500)">
          @switch (toast.icon) {
            @case ('x') {
              <svg lucideX [size]="17" [strokeWidth]="2.4"></svg>
            }
            @case ('trash-2') {
              <svg lucideTrash2 [size]="17" [strokeWidth]="2.4"></svg>
            }
            @default {
              <svg lucideCheck [size]="17" [strokeWidth]="2.4"></svg>
            }
          }
        </span>
        {{ toast.text }}
      </div>
    }
  `,
})
export class SpToastHost {
  protected readonly toastService = inject(ToastService);
}
