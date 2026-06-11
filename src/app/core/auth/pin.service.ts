import { Injectable, signal } from '@angular/core';
import { supabase } from '../supabase/supabase.client';

const STORAGE_KEY = 'spotter_operator_pin';

/**
 * Lightweight operator gate: one shared PIN unlocks the Spieler, Spiele,
 * Station and Kategorien areas. The PIN lives bcrypt-hashed in the database
 * (app_settings) and is checked via the verify_operator_pin RPC. The entered
 * PIN is persisted and re-verified on the next visit, so changing the stored
 * PIN re-locks existing devices.
 */
@Injectable({ providedIn: 'root' })
export class PinService {
  private readonly _unlocked = signal(false);
  readonly unlocked = this._unlocked.asReadonly();

  private restored: Promise<void> | null = null;

  /** Re-verifies a previously entered PIN against the database, once. */
  restore(): Promise<void> {
    return (this.restored ??= this.restoreStored());
  }

  async tryUnlock(pin: string): Promise<boolean> {
    if (!(await this.verify(pin))) return false;
    try {
      localStorage.setItem(STORAGE_KEY, pin);
    } catch {
      // Storage unavailable (private mode) — unlock for this session only.
    }
    this._unlocked.set(true);
    return true;
  }

  private async restoreStored(): Promise<void> {
    const stored = this.readStored();
    if (stored && (await this.verify(stored))) this._unlocked.set(true);
  }

  private async verify(pin: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('verify_operator_pin', { pin });
    return !error && data === true;
  }

  private readStored(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }
}
