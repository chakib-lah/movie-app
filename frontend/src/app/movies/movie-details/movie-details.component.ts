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
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MovieService } from '../movie.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { Movie } from '../movie.model';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink, MatCardModule, MatListModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

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
}
