import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MovieService } from './movie.service';
import { ErrorService } from '@core/services/error.service';
import { Movie, NewMovie } from '@features/movies/models';
import { environment } from '@env/environment';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  const baseUrl = `${environment.apiUrl}/movies`;

  beforeEach(() => {
    const errorSpy = jasmine.createSpyObj('ErrorService', ['showError']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService, { provide: ErrorService, useValue: errorSpy }],
    });

    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
    errorServiceSpy = TestBed.inject(
      ErrorService
    ) as jasmine.SpyObj<ErrorService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch all movies and map _id to id', () => {
    const mockMovies: (Omit<Movie, 'id'> & { id: string })[] = [
      { _id: '1', id: '1', title: 'Movie 1', director: 'X', year: 2020 },
      { _id: '2', id: '2', title: 'Movie 2', director: 'Y', year: 2021 },
    ];

    service.getAllMovies().subscribe((movies) => {
      expect(movies.length).toBe(2);
      expect(movies[0].id).toBe('1');
      expect(movies[1].id).toBe('2');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should fetch a movie by ID', () => {
    const mockMovie = { _id: '1', title: 'Test' } as Movie;

    service.getMovieById('1').subscribe((movie) => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  });

  it('should add a new movie', () => {
    const newMovie: NewMovie = { title: 'New', director: 'John', year: 2020 };
    const createdMovie: Movie = { ...newMovie, _id: 'abc', id: 'abc' };

    service.addMovie(newMovie).subscribe((movie) => {
      expect(movie._id).toBe('abc');
    });

    const req = httpMock.expectOne(baseUrl);
    expect(req.request.method).toBe('POST');
    req.flush(createdMovie);
  });

  it('should update a movie', () => {
    const updatedMovie: Movie = {
      _id: '1',
      title: 'Updated',
      director: '',
      year: 2021,
    };

    service.updateMovie(updatedMovie).subscribe((response) => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toBe('PUT');
    req.flush({ success: true });
  });

  it('should remove a movie by ID', () => {
    const id = '123';

    service.removeMovie(id).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const req = httpMock.expectOne(`${baseUrl}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ success: true });
  });

  it('should call errorService on error', () => {
    service.getAllMovies().subscribe({
      next: () => fail('should fail'),
      error: () => {
        expect(errorServiceSpy.showError).toHaveBeenCalledWith(
          'Failed to fetch movies.'
        );
      },
    });

    const req = httpMock.expectOne(baseUrl);
    req.error(new ErrorEvent('Network error'));
  });
});
