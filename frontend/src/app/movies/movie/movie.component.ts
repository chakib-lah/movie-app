import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';

import { MovieService } from '../movie.service';

@Component({
  selector: 'app-movie',
  imports: [MatCardModule, MatListModule, RouterLink],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  private movieService = inject(MovieService);
  movies = this.movieService.allMovies();
}
