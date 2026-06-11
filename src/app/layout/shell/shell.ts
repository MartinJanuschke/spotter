import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { TranslocoPipe } from '@jsverse/transloco';
import type { LucideIconData } from '@lucide/angular';
import { PinService } from '../../core/auth/pin.service';
import { SpToastHost } from '../../ui/toast/toast-host';
import { SpConfirmDialog } from '../../ui/confirm-dialog/confirm-dialog';
import {
  LucideChartColumn,
  LucideDynamicIcon,
  LucideGamepad2,
  LucideLayers,
  LucideLock,
  LucideScanLine,
  LucideUsers,
} from '../../ui/icons';

interface TabDef {
  path: string;
  labelKey: string;
  icon: LucideIconData;
  accent?: boolean;
  locked?: boolean;
}

@Component({
  selector: 'app-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslocoPipe,
    SpToastHost,
    SpConfirmDialog,
    LucideDynamicIcon,
    LucideLock,
  ],
  templateUrl: './shell.html',
})
export class ShellComponent {
  protected readonly pinService = inject(PinService);
  private readonly router = inject(Router);

  /** Rangliste widens to a projector-friendly layout on large screens. */
  protected readonly isRangliste = toSignal(
    this.router.events.pipe(
      filter((e) => e instanceof NavigationEnd),
      map(() => this.router.url.startsWith('/rangliste')),
    ),
    { initialValue: this.router.url.startsWith('/rangliste') },
  );

  protected readonly tabs: TabDef[] = [
    { path: '/spieler', labelKey: 'shell.tabs.players', icon: LucideUsers.icon, locked: true },
    { path: '/spiele', labelKey: 'shell.tabs.games', icon: LucideGamepad2.icon, locked: true },
    {
      path: '/station',
      labelKey: 'shell.tabs.station',
      icon: LucideScanLine.icon,
      accent: true,
      locked: true,
    },
    { path: '/rangliste', labelKey: 'shell.tabs.leaderboard', icon: LucideChartColumn.icon },
    {
      path: '/kategorien',
      labelKey: 'shell.tabs.categories',
      icon: LucideLayers.icon,
      locked: true,
    },
  ];
}
