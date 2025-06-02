import { Component, input, OnInit, output, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Movie } from '../movie.model';

@Component({
  selector: 'app-movie-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButton,
    MatIconModule,
  ],
  templateUrl: './movie-form.component.html',
  styleUrl: './movie-form.component.css',
})
export class MovieFormComponent implements OnInit{
  movie = input<Movie | null>(null);
  submitLabel = input<string>('Save');
  submitForm = output<Movie>();
  cancelForm = output<void>();

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    title: new FormControl('', [Validators.required]),
    director: new FormControl('', [Validators.required]),
    year: new FormControl<number | null>(null, [
      Validators.required,
      Validators.pattern(/^[0-9]{4}$/),
    ]),
  });

  ngOnInit() {
    const m = this.movie();
    if (m) {
      const { title, director, year } = m;
      this.form.patchValue({ title, director, year });
    }
  }
  onSubmit() {
    if (this.form.invalid) return;
    this.isLoading.set(true);
    this.submitForm.emit(this.form.value as Movie);
  }

  onReset() {
    this.form.reset(this.movie() || {});
  }

  onCancel() {
    this.cancelForm.emit();
  }

  getErrorMessage(controlName: 'title' | 'director' | 'year'): string {
    const control = this.form.controls[controlName];
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('pattern')) return 'Enter a valid year';
    return '';
  }
}
