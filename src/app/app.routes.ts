import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';
import { pinGuard } from './core/auth/pin.guard';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'rangliste', pathMatch: 'full' },
      {
        path: 'rangliste',
        loadComponent: () =>
          import('./feature/leaderboard/leaderboard').then((m) => m.LeaderboardPage),
      },
      {
        path: 'spieler',
        canActivate: [pinGuard],
        loadComponent: () => import('./feature/players/players').then((m) => m.PlayersPage),
      },
      {
        path: 'spiele',
        canActivate: [pinGuard],
        loadComponent: () => import('./feature/games/games').then((m) => m.GamesPage),
      },
      {
        path: 'station',
        canActivate: [pinGuard],
        loadComponent: () => import('./feature/station/station').then((m) => m.StationPage),
      },
      {
        path: 'kategorien',
        canActivate: [pinGuard],
        loadComponent: () =>
          import('./feature/categories/categories').then((m) => m.CategoriesPage),
      },
      {
        path: 'pin',
        loadComponent: () => import('./feature/pin/pin').then((m) => m.PinPage),
      },
    ],
  },
  { path: '**', redirectTo: 'rangliste' },
];
