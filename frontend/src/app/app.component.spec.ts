import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { ErrorService } from './core/services/error.service';
import { signal } from '@angular/core';
import { of } from 'rxjs';

// Minimal stub for <app-nav> component
import { Component } from '@angular/core';
@Component({
  selector: 'app-nav',
  standalone: true,
  template: '<div>Mock Nav</div>',
})
class MockNavComponent {}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, MockNavComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: {
            isLoggedIn: signal(false),
            getUserProfile: () => of({ email: 'test@test.com', _id: '123' }),
            logout: () => of(true),
          },
        },
        {
          provide: ErrorService,
          useValue: {
            error: signal<string | null>(null),
            showError: () => {},
            clearError: () => {},
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'frontend' title`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('frontend');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('main')).toBeTruthy();
  });
});
