import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { signal } from '@angular/core';

import { MovieListComponent } from './movie-list.component';
import { ErrorService } from '@core/services/error.service';
import { MovieService } from '@features/movies/services';
import { Movie } from '@features/movies/models';

describe('MovieListComponent', () => {
  let component: MovieListComponent;
  let fixture: ComponentFixture<MovieListComponent>;
  let movieService: jasmine.SpyObj<MovieService>;
  let errorService: jasmine.SpyObj<ErrorService>;

  beforeEach(() => {
    const movieSpy = jasmine.createSpyObj('MovieService', ['getAllMovies']);
    const errorSpy = jasmine.createSpyObj('ErrorService', ['showError']);

    TestBed.configureTestingModule({
      imports: [MovieListComponent],
      providers: [
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MovieService, useValue: movieSpy },
        {
          provide: ErrorService,
          useValue: {
            ...errorSpy,
            error: signal<string | null>(null),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(MovieListComponent);
    component = fixture.componentInstance;
    movieService = TestBed.inject(MovieService) as jasmine.SpyObj<MovieService>;
    errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch movies and update the signal', fakeAsync(() => {
    type MovieWithId = Omit<Movie, 'id'> & { id: string };
    const mockMovies: MovieWithId[] = [
      {
        _id: '1',
        id: '1', // Explicitly include 'id' as string
        title: 'Inception',
        director: 'Christopher Nolan',
        year: 2010,
      },
    ];

    movieService.getAllMovies.and.returnValue(of(mockMovies));

    component.ngOnInit();
    tick();

    expect(component.movies()).toEqual(mockMovies);
    expect(component.hasMovies()).toBeTrue();
  }));

  it('should show error message when fetching fails', fakeAsync(() => {
    const error = { message: 'Failed to load movies' };
    movieService.getAllMovies.and.returnValue(throwError(() => error));

    component.ngOnInit();
    tick();

    expect(errorService.showError).toHaveBeenCalledWith('Failed to load movies');
  }));
});
