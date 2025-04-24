import { Component, signal } from '@angular/core';
import { MOVIES } from '../movie.data';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-movie',
  imports: [MatCardModule, MatListModule],
  templateUrl: './movie.component.html',
  styleUrl: './movie.component.css',
})
export class MovieComponent {
  movies = signal(MOVIES);
}
