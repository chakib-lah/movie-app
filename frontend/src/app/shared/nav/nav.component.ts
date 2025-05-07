import { Component, inject, Signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-nav',
  imports: [MatToolbarModule, RouterLink, MatButton],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly isLoggedIn: Signal<boolean> = this.authService.isLoggedIn;

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
