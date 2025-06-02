import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistreComponent } from './registre.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ErrorService } from '../../core/services/error.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

describe('RegistreComponent', () => {
  let component: RegistreComponent;
  let fixture: ComponentFixture<RegistreComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockErrorService: jasmine.SpyObj<ErrorService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['register']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockErrorService = jasmine.createSpyObj('ErrorService', ['showError']);

    await TestBed.configureTestingModule({
      imports: [
        RegistreComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ErrorService, useValue: mockErrorService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegistreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form if empty', () => {
    component.form.reset();
    expect(component.form.invalid).toBeTrue();
  });

  it('should show password mismatch error', () => {
    component.form.setValue({
      email: 'test@example.com',
      passwords: {
        password: '123456',
        confirmPassword: '654321',
      },
    });

    const passwordsGroup = component.form.get('passwords');
    expect(passwordsGroup?.errors?.['passwordMismatch']).toBeTrue();
  });

  it('should call AuthService.register on valid form', () => {
    mockAuthService.register.and.returnValue(of({}));

    component.form.setValue({
      email: 'test@example.com',
      passwords: {
        password: '123456',
        confirmPassword: '123456',
      },
    });

    component.onSubmit();
    expect(mockAuthService.register).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should handle register error properly', () => {
    const mockError = { error: { message: 'Email already used' } };
    mockAuthService.register.and.returnValue(throwError(() => mockError));

    component.form.setValue({
      email: 'fail@example.com',
      passwords: {
        password: '123456',
        confirmPassword: '123456',
      },
    });

    component.onSubmit();
    expect(mockErrorService.showError).toHaveBeenCalledWith('Email already used');
    expect(component.errorMessage()).toBe('Email already used');
  });
});
