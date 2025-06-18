import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MovieFormComponent } from '@features/movies/movie-form/movie-form.component';
import { NewMovie } from '@features/movies/models';
import { MovieService } from '@features/movies/services';
import { ErrorService } from '@core/services/error.service';

@Component({
  selector: 'app-add-movie',
  imports: [MovieFormComponent],
  templateUrl: './add-movie.component.html',
  styleUrl: './add-movie.component.css',
})
export class AddMovieComponent {
  private router = inject(Router);
  private errorService = inject(ErrorService);
  private movieService = inject(MovieService);

  onCreateMovie(movie: NewMovie) {
    console.log(movie);
    this.movieService.addMovie(movie).subscribe({
      next: () => this.router.navigate(['/movies']),
      error: (err) =>
        this.errorService.showError(
          err.error?.message || 'Failed to add movie.'
        ),
    });
  }

  onCancel() {
    this.router.navigate(['/movies']);
  }
}
