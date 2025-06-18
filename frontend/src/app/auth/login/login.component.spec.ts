import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '@core/services/auth.service';
import { ErrorService } from '@core/services/error.service';
import { MovieListComponent } from '@features/movies/movie-list/movie-list.component';


describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let authService: jasmine.SpyObj<AuthService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['showError', 'clearError']);

    TestBed.configureTestingModule({
      imports: [LoginComponent, MovieListComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter([{ path: 'movies', component: MovieListComponent }]),
        { provide: AuthService, useValue: authSpy },
        {
          provide: ErrorService,
          useValue: {
            ...errorSpy,
            error: signal<string | null>(null),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
    fixture.detectChanges();
  });

  it('should create the login component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form if empty', () => {
    component.form.setValue({ email: '', password: '' });
    expect(component.form.invalid).toBeTrue();
  });

  it('should display error message for invalid email', () => {
    component.form.controls.email.setValue('invalid-email');
    component.form.controls.email.markAsTouched();
    fixture.detectChanges();
    const msg = component.getErrorMessage('email');
    expect(msg).toBe('Please enter a valid email');
  });

  it('should show error message if login fails', fakeAsync(() => {
    const error = { error: { message: 'Invalid credentials' } };
    authService.login.and.returnValue(throwError(() => error));

    component.form.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();
    tick();

    expect(errorService.showError).toHaveBeenCalledWith('Invalid credentials');
  }));

  it('should call AuthService.login on valid form', fakeAsync(() => {
    const mockResponse = { accessToken: 'mock-token' };
    authService.login.and.returnValue(of(mockResponse));

    component.form.setValue({ email: 'test@test.com', password: '123456' });
    component.onSubmit();
    tick();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: '123456',
    });
    expect(authService.setToken).toHaveBeenCalledWith('mock-token');
  }));
});
