import { Injectable, signal } from '@angular/core';
import { MOVIES } from './movie.data';

@Injectable({ providedIn: 'root' })
export class MovieService {
  movies = signal(MOVIES);
  allMovies = this.movies.asReadonly();

  getMovieById(id: string) {
    return this.movies().filter((movie) => movie.id === id)[0];
  }
}
