import { Component, computed, inject, input, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { MovieService } from '../movie.service';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-movie-details',
  imports: [RouterLink, MatCardModule, MatListModule],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.css',
})
export class MovieDetailsComponent {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);

  id = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('movieId')))
  );
  movie = computed(() => this.movieService.getMovieById(this.id()!));


}
