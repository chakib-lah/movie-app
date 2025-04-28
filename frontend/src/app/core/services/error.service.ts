import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private snackBar = inject(MatSnackBar);
  private _error = signal('');

  error = this._error.asReadonly();

  showError(message: string): void {
    console.log(message);
    this._error.set(message);
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }

  clearError() {
    this._error.set('');
  }
}
