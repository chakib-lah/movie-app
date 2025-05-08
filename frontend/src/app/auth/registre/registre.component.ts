import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ErrorService } from '../../core/services/error.service';

function matchPasswords(controlName1: string, controlName2: string) {
  return (group: AbstractControl): { [key: string]: any } | null => {
    const control1 = group.get(controlName1);
    const control2 = group.get(controlName2);

    if (!control1 || !control2) return null;

    return control1.value === control2.value
      ? null
      : { passwordMismatch: true };
  };
}

@Component({
  selector: 'app-registre',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './registre.component.html',
  styleUrl: './registre.component.css',
})
export class RegistreComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private errorService = inject(ErrorService);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  readonly form = new FormGroup({
    email: new FormControl('', {
      validators: [Validators.email, Validators.required],
    }),
    passwords: new FormGroup(
      {
        password: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
        confirmPassword: new FormControl('', {
          validators: [Validators.required, Validators.minLength(6)],
        }),
      },
      {
        validators: [matchPasswords('password', 'confirmPassword')],
      }
    ),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const { email, passwords } = this.form.getRawValue();
    const password = passwords?.password;

    if (!email || !password) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.register({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        const message =
          err.error?.message || 'Something went wrong. Please try again.';
        this.errorService.showError(message);
        this.errorMessage.set(message);
      },
      complete: () => this.isLoading.set(false),
    });
  }

  onReset() {
    this.form.reset();
  }
}
