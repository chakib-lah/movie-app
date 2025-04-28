import { Routes } from '@angular/router';
import { MovieDetailsComponent } from './movies/movie-details/movie-details.component';

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
];
