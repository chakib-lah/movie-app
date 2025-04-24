import { Component, signal } from '@angular/core';
import { MOVIES } from '../movie.data';

@Component({
  selector: 'app-movie',
  imports: [],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  movies = signal(MOVIES);
}
