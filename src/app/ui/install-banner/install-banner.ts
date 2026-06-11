import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { PwaInstallService } from '../../core/pwa/pwa-install.service';
import { LucideShare, LucideSquarePlus, LucideX } from '../icons';

/**
 * Install hint card, floating above the tab bar. Chromium gets the native
 * install prompt via a button; iOS Safari gets Share → "Add to Home Screen"
 * instructions since it has no install API.
 */
@Component({
  selector: 'sp-install-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe, LucideShare, LucideSquarePlus, LucideX],
  template: `
    @if (installService.hint(); as hint) {
      <div
        class="absolute right-4 bottom-[86px] left-4 z-30 rounded-(--r-lg) bg-(--ink-900) p-4 text-white shadow-(--shadow-lg) [animation:sp-up_.28s_var(--ease-out)]"
        role="dialog"
        [attr.aria-label]="'install.title' | transloco"
      >
        <div class="flex items-start gap-3">
          <img src="icons/icon-192.png" alt="" class="h-10 w-10 flex-none rounded-(--r-sm)" />
          <div class="min-w-0 flex-1">
            <p class="m-0 font-display text-[15px] font-semibold tracking-(--ls-tight)">
              {{ 'install.title' | transloco }}
            </p>
            @if (hint === 'native') {
              <p class="m-0 mt-0.5 font-body text-[13px] text-(--text-on-dark-muted)">
                {{ 'install.body' | transloco }}
              </p>
            } @else {
              <p class="m-0 mt-1.5 flex items-center gap-1.5 font-body text-[13px]">
                <svg lucideShare [size]="15" [strokeWidth]="2.2" class="flex-none text-(--info-500)"></svg>
                {{ 'install.iosShare' | transloco }}
              </p>
              <p class="m-0 mt-1 flex items-center gap-1.5 font-body text-[13px]">
                <svg lucideSquarePlus [size]="15" [strokeWidth]="2.2" class="flex-none text-(--info-500)"></svg>
                {{ 'install.iosAdd' | transloco }}
              </p>
            }
            @if (hint === 'native') {
              <button
                type="button"
                class="mt-3 inline-flex h-[38px] cursor-pointer items-center justify-center rounded-(--r-md) border-0 bg-(--red-500) px-5 font-body text-[13.5px] font-semibold text-white [-webkit-tap-highlight-color:transparent]"
                (click)="installService.install()"
              >
                {{ 'install.action' | transloco }}
              </button>
            }
          </div>
          <button
            type="button"
            class="-mt-1 -mr-1 flex h-8 w-8 flex-none cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-(--text-on-dark-muted) [-webkit-tap-highlight-color:transparent]"
            [attr.aria-label]="'install.dismiss' | transloco"
            (click)="installService.dismiss()"
          >
            <svg lucideX [size]="17" [strokeWidth]="2.4"></svg>
          </button>
        </div>
      </div>
    }
  `,
})
export class SpInstallBanner {
  protected readonly installService = inject(PwaInstallService);
}
