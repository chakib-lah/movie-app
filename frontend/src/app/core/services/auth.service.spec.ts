import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockToken = 'test-token';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log in and return an access token', () => {
    const credentials = { email: 'test@test.com', password: '123456' };

    service.login(credentials).subscribe((res) => {
      expect(res.accessToken).toEqual(mockToken);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: mockToken });
  });

  it('should set and get token correctly', () => {
    service.setToken(mockToken);
    expect(service.getToken()).toBe(mockToken);
  });

  it('should refresh token', () => {
    service.refreshToken().subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(req.request.method).toBe('POST');
    req.flush({ accessToken: mockToken });

    expect(service.getToken()).toBe(mockToken);
  });

  it('should logout and clear token', () => {
    service.setToken(mockToken);

    service.logout().subscribe();
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/logout`);
    expect(req.request.method).toBe('POST');
    req.flush({});

    expect(service.getToken()).toBeNull();
  });

  it('should fetch user profile', () => {
    const mockProfile = { email: 'test@test.com', _id: '123' };

    service.getUserProfile().subscribe((profile) => {
      expect(profile).toEqual(mockProfile);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProfile);
  });
});
