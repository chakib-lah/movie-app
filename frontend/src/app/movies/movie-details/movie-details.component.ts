import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MovieService } from '../movie.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Movie } from '../movie.model';
import { MatButton } from '@angular/material/button';
import { ErrorService } from '../../core/services/error.service';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink, MatCardModule, MatListModule, MatButton],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private movieService = inject(MovieService);
  private errorService = inject(ErrorService);

  readonly id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('movieId'))),
    { initialValue: null }
  );

  readonly movie = signal<Movie | null>(null);

  constructor() {
    effect(() => {
      const id = this.id();
      if (id) {
        this.movieService.getMovieById(id).subscribe({
          next: (movie) => this.movie.set(movie),
          error: (err) => console.error('Failed to load movie:', err),
        });
      }
    });
  }

  onEdit() {
    const id = this.route.snapshot.paramMap.get('movieId');
    this.router.navigate(['/movies/edit', id]);
  }

  onDeleteMovie() {
    const current = this.movie();
    if (!current || !current._id) return;

    if (!confirm('Are you sure you want to delete this movie?')) return;

    this.movieService.removeMovie(current._id).subscribe({
      next: () => {
        this.errorService.showSuccess('Movie deleted');
        this.router.navigate(['/movies']);
      },
      error: () => {
        this.errorService.showError('Failed to delete movie');
      },
    });
  }
}
