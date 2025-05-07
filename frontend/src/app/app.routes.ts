import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistreComponent } from './auth/registre/registre.component';

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
        loadComponent: () =>
          import('./movies/movie/movie.component').then(
            (mod) => mod.MovieComponent
          ),
      },
      {
        path: 'movies/:movieId',
        component: MovieDetailsComponent,
      }
    ],
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegistreComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];
