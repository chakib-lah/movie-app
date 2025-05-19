import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = signal<{ email: string; _id: string } | null>(null);
  tokenExp = signal<string>('');

  ngOnInit() {
    this.authService.getUserProfile().subscribe({
      next: (data) => this.user.set(data),
      error: () => this.user.set(null),
    });

    const token = this.authService.getToken();
    if (token) {
      const { exp } = JSON.parse(atob(token.split('.')[1]));
      this.tokenExp.set(new Date(exp * 1000).toLocaleString());
    }
  }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  goToMovies() {
    this.router.navigate(['/movies']);
  }
}
