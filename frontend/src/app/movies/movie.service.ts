import { Injectable } from '@angular/core';
import { MOVIES } from './movie.data';

@Injectable({ providedIn: 'root' })
export class MovieService {
  movies = MOVIES;
  get allMovies() {
    return this.movies;
  }
  getMovieById(id: string) {
    return this.movies.filter((movie) => movie.id === id)[0];
  }
}
