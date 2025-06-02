import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieFormComponent } from '../movie-form/movie-form.component';
import { Movie } from '../movie.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MovieService } from '../movie.service';
import { ErrorService } from '../../core/services/error.service';

@Component({
  selector: 'app-edit-movie',
  imports: [MovieFormComponent],
  templateUrl: './edit-movie.component.html',
  styleUrl: './edit-movie.component.css',
})
export class EditMovieComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  movie = signal<Movie | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('movieId');
    if (!id) {
      this.router.navigate(['/movies']);
      return;
    }

    this.movieService.getMovieById(id).subscribe({
      next: (movie) => this.movie.set(movie),
      error: () => {
        this.errorService.showError('Failed to load movie');
        this.router.navigate(['/movies']);
      },
    });
  }

  onUpdateMovie(movie: Omit<Movie, '_id'>) {
    const currentMovie = this.movie();
    if (!currentMovie) return;

    const updatedMovie: Movie = { ...currentMovie, ...movie };
    this.movieService.updateMovie(updatedMovie).subscribe({
      next: () => {
        this.errorService.showSuccess('Movie updated');
        this.router.navigate(['/movies']);
      },
      error: () => {
        this.errorService.showError('Failed to update movie');
      },
    });
  }

  onCancel() {
    this.router.navigate(['/movies']);
  }
}
