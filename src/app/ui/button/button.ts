import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost';
type ButtonSize = 'md' | 'lg';

/**
 * Design-system button. Variants: primary (ink), accent (red, with glow),
 * secondary (card + border), ghost (transparent). Sizes: md 46px, lg 54px.
 */
@Component({
  selector: 'sp-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [disabled]="disabled()" [class]="classes()" (click)="pressed.emit()">
      <ng-content />
    </button>
  `,
  host: {
    '[style.display]': "block() ? 'block' : 'inline-block'",
    '[style.flex]': "block() ? '1 1 0%' : 'none'",
    '[style.minWidth]': "block() ? '0' : null",
  },
})
export class SpButton {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('lg');
  readonly block = input(false);
  readonly disabled = input(false);
  readonly pressed = output<void>();

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center gap-2 font-body font-semibold cursor-pointer ' +
      'whitespace-nowrap rounded-(--r-md) border-0 transition-transform duration-(--dur-fast) ' +
      'active:scale-[.97] disabled:opacity-50 disabled:cursor-not-allowed select-none ' +
      '[-webkit-tap-highlight-color:transparent]';
    const size = this.size() === 'lg' ? 'h-[54px] px-6 text-[16px]' : 'h-[46px] px-5 text-[14.5px]';
    const block = this.block() ? 'w-full' : '';
    const variant = {
      primary: 'bg-(--ink-900) text-white',
      accent: 'bg-(--red-500) text-white shadow-(--shadow-accent)',
      secondary: 'bg-(--surface-card) text-(--text-strong) border-[1.5px] border-(--border-subtle)',
      ghost: 'bg-transparent text-(--text-strong)',
    }[this.variant()];
    return `${base} ${size} ${block} ${variant}`;
  });
}
