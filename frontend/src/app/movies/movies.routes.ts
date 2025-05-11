import { Routes } from '@angular/router';
import { MovieListComponent } from './movie-list/movie-list.component';
import { MovieDetailsComponent } from './movie-details/movie-details.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { EditMovieComponent } from './edit-movie/edit-movie.component';

export const movieRoutes: Routes = [
  {
    path: '',
    component: MovieListComponent,
  },
  {
    path: 'addMovie',
    component: AddMovieComponent,
  },
  {
    path: 'edit/:movieId',
    component: EditMovieComponent,
  },
  {
    path: ':movieId',
    component: MovieDetailsComponent,
  },
];
