import { Routes } from '@angular/router';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistreComponent } from './auth/registre/registre.component';
import { authGuard } from './core/services/auth.guard';
import { guestGuard } from './core/services/guest.guard';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'movies',
        pathMatch: 'full',
      },
      {
        path: 'movies',
        canActivate: [authGuard],
        loadChildren: () =>
          import('./movies/movies.routes').then((m) => m.movieRoutes),
      },
      {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./profile/profile.component').then((m) => m.ProfileComponent),
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegistreComponent,
    canActivate: [guestGuard],
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
