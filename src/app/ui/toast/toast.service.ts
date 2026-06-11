import { Injectable, signal } from '@angular/core';

export type ToastIcon = 'check' | 'x' | 'trash-2';

export interface Toast {
  text: string;
  icon: ToastIcon;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toast = signal<Toast | null>(null);
  readonly toast = this._toast.asReadonly();

  private timer: ReturnType<typeof setTimeout> | null = null;

  show(text: string, icon: ToastIcon = 'check'): void {
    this._toast.set({ text, icon });
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => this._toast.set(null), 2200);
  }
}
