import { Injectable, signal } from '@angular/core';

export interface ConfirmRequest {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  danger: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private readonly _request = signal<ConfirmRequest | null>(null);
  readonly request = this._request.asReadonly();

  private resolver: ((result: boolean) => void) | null = null;

  confirm(options: {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    danger?: boolean;
  }): Promise<boolean> {
    this.resolver?.(false);
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
      this._request.set({ danger: false, ...options });
    });
  }

  resolve(result: boolean): void {
    this._request.set(null);
    this.resolver?.(result);
    this.resolver = null;
  }
}
