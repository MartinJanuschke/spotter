import { Routes } from '@angular/router';
import { ShellComponent } from './layout/shell/shell';

export const routes: Routes = [
  {
    path: 'register/:id',
    loadComponent: () =>
      import('./feature/register/register').then((m) => m.RegisterPage),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'leaderboard', pathMatch: 'full' },
      {
        path: 'leaderboard',
        loadComponent: () =>
          import('./feature/leaderboard/leaderboard').then((m) => m.LeaderboardPage),
      },
      {
        path: 'players',
        loadComponent: () =>
          import('./feature/players/players').then((m) => m.PlayersPage),
      },
      {
        path: 'games',
        loadComponent: () => import('./feature/games/games').then((m) => m.GamesPage),
      },
      {
        path: 'scores',
        loadComponent: () => import('./feature/scores/scores').then((m) => m.ScoresPage),
      },
    ],
  },
  { path: '**', redirectTo: 'leaderboard' },
];
