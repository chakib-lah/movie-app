import { Routes } from '@angular/router';
import { MovieComponent } from './movie/movie.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';

export const movieRoutes: Routes = [
  {
    path: '',
    component: MovieComponent,
  },
  {
    path: ':movieId',
    component: MovieDetailsComponent,
  },
];