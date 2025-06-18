import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '@core/services/auth.service';
import { ErrorService } from '@core/services/error.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInputModule,
    MatButton,
    MatIconModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  isLoading = signal(false);
  readonly errorMessage = this.errorService.error;


  readonly form = new FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email, Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  getErrorMessage(controlName: 'email' | 'password'): string {
    const control = this.form.controls[controlName];
    if (control.hasError('required')) return 'This field is required';
    if (control.hasError('email')) return 'Please enter a valid email';
    if (control.hasError('minlength'))
      return 'Password must be at least 6 characters';
    return '';
  }

  onSubmit() {
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();
    if (!email || !password) return;

    this.isLoading.set(true);
    this.errorService.clearError();

    this.authService.login({ email, password }).subscribe({
      next: (response) => {
        this.authService.setToken(response.accessToken);
        this.router.navigate(['/movies']);
      },
      error: (err) => {
        this.errorService.showError(
          err.error?.message || 'Login failed. Please try again.'
        );
        this.isLoading.set(false)
      },
      complete: () => this.isLoading.set(false),
    });
  }
}
