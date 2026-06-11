import { computed, Injectable, signal } from '@angular/core';

/** Chromium-only event, not yet in the standard DOM lib. */
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'sp.installHintDismissedAt';
const DISMISS_FOR_MS = 14 * 24 * 60 * 60 * 1000;

/**
 * Tracks PWA install state: captures Chromium's `beforeinstallprompt` for a
 * native install flow and detects iOS Safari, where installing is only
 * possible manually via Share → "Add to Home Screen".
 */
@Injectable({ providedIn: 'root' })
export class PwaInstallService {
  private readonly promptEvent = signal<BeforeInstallPromptEvent | null>(null);
  private readonly installed = signal(this.isStandalone());
  private readonly dismissedAt = signal(this.readDismissedAt());

  /** Which install hint to show: native prompt button, iOS instructions, or none. */
  readonly hint = computed<'native' | 'ios' | null>(() => {
    if (this.installed() || Date.now() - this.dismissedAt() < DISMISS_FOR_MS) return null;
    if (this.promptEvent()) return 'native';
    if (this.isIos()) return 'ios';
    return null;
  });

  constructor() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.promptEvent.set(e as BeforeInstallPromptEvent);
    });
    window.addEventListener('appinstalled', () => {
      this.promptEvent.set(null);
      this.installed.set(true);
    });
  }

  async install(): Promise<void> {
    const event = this.promptEvent();
    if (!event) return;
    const { outcome } = await event.prompt();
    this.promptEvent.set(null);
    if (outcome === 'dismissed') this.dismiss();
  }

  dismiss(): void {
    this.dismissedAt.set(Date.now());
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* storage unavailable (private mode) — hint stays hidden for the session */
    }
  }

  private isStandalone(): boolean {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true
    );
  }

  private isIos(): boolean {
    const ua = navigator.userAgent;
    // iPadOS reports itself as macOS but is the only Mac with touch support.
    const iPadOs = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    return /iPhone|iPad|iPod/i.test(ua) || iPadOs;
  }

  private readDismissedAt(): number {
    try {
      return Number(localStorage.getItem(DISMISSED_KEY)) || 0;
    } catch {
      return 0;
    }
  }
}
