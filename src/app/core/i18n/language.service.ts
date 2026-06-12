import { Injectable, inject, signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

const STORAGE_KEY = 'spotter.lang';

export type AppLang = 'de' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly transloco = inject(TranslocoService);

  readonly languages: readonly AppLang[] = ['de', 'en'];
  readonly active = signal<AppLang>(this.transloco.getDefaultLang() as AppLang);

  constructor() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && this.languages.includes(stored as AppLang)) {
      this.set(stored as AppLang);
    }
  }

  set(lang: AppLang): void {
    this.transloco.setActiveLang(lang);
    this.active.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }
}
