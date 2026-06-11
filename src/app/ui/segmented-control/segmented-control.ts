import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

export interface SegmentOption {
  /** Transloco key — translated inside the control so labels react to language loading. */
  label: string;
  value: string;
}

/** Design-system segmented control: 44px sunken track, ink-filled active segment. */
@Component({
  selector: 'sp-segmented-control',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  template: `
    <div
      class="flex h-11 w-full items-center gap-1 rounded-(--r-pill) bg-(--surface-sunken) p-1"
      role="tablist"
    >
      @for (option of options(); track option.value) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="option.value === value()"
          (click)="value.set(option.value)"
          class="h-9 flex-1 cursor-pointer rounded-(--r-pill) border-0 font-body text-[13.5px] font-semibold transition-colors duration-(--dur-base) [-webkit-tap-highlight-color:transparent]"
          [class]="
            option.value === value()
              ? 'bg-(--ink-900) text-white shadow-(--shadow-sm)'
              : 'bg-transparent text-(--text-body)'
          "
        >
          {{ option.label | transloco }}
        </button>
      }
    </div>
  `,
})
export class SpSegmentedControl {
  readonly options = input.required<SegmentOption[]>();
  readonly value = model.required<string>();
}
