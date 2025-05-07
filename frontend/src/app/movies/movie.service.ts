import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, map, throwError } from 'rxjs';
import { ErrorService } from '../core/services/error.service';
import { Movie } from './movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private http = inject(HttpClient);
  private errorService = inject(ErrorService);
  private baseUrl = `${environment.apiUrl}/movies`;

  getAllMovies() {
    return this.http.get<Movie[]>(this.baseUrl).pipe(
      map((movies) =>
        movies.map((movie) => ({
          ...movie,
          id: movie._id,
        }))
      ),
      catchError((error) => this.handleError(error, 'Failed to fetch movies.'))
    );
  }

  getMovieById(id: string) {
    console.log(id);
    return this.http
      .get<Movie>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'Failed to fetch movies.')
        )
      );
  }

  addMovie(movie: Movie) {
    return this.http
      .post<Movie>(this.baseUrl, movie)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'Failed to fetch movies.')
        )
      );
  }

  updateMovie(movie: Movie) {
    return this.http
      .put(`${this.baseUrl}/${movie.id}`, movie)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'Failed to update movie.')
        )
      );
  }

  removeMovie(movie: Movie) {
    return this.http
      .delete(`${this.baseUrl}/${movie.id}`)
      .pipe(
        catchError((error) =>
          this.handleError(error, 'Failed to remove movie.')
        )
      );
  }

  // Centralized error handler
  private handleError(error: any, message: string) {
    console.error(error);
    this.errorService.showError(message);
    return throwError(() => new Error(message));
  }
}
