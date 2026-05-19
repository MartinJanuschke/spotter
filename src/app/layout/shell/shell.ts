import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslocoService, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslocoPipe],
  templateUrl: './shell.html',
})
export class ShellComponent {
  protected readonly transloco = inject(TranslocoService);

  protected setLang(lang: string): void {
    this.transloco.setActiveLang(lang);
  }

  protected get activeLang(): string {
    return this.transloco.getActiveLang();
  }
}
