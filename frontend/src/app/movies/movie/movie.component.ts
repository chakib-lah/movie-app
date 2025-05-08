import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { MovieService } from '../movie.service';
import { Movie } from '../movie.model';
import { ErrorService } from '../../core/services/error.service';

@Component({
  selector: 'app-movie',
  imports: [MatCardModule, MatListModule, RouterLink],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent implements OnInit {
  private movieService = inject(MovieService);
  private errorService = inject(ErrorService);
  private destroyRef = inject(DestroyRef);

  isFetching = signal(false);
  movies = signal<Movie[] | null>(null);
  // movies = this.movieService.allMovies();
  hasMovies = computed(() => !!this.movies()?.length);

  ngOnInit(): void {
    const subscrption = this.movieService.getAllMovies().subscribe({
      next: (movies) => {
        this.movies.set(movies);
      },
      error: (error) => {
        this.errorService.showError(error.message);
      },
      complete: () => {
        this.isFetching.set(false);
      },
    });

    this.destroyRef.onDestroy(() => {
      subscrption.unsubscribe();
    });
  }
}
