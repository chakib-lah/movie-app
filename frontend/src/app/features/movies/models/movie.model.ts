export interface Movie {
  _id: string;
  id?: string; // optional alias
  title: string;
  director: string;
  year: number;
}

export type NewMovie = Omit<Movie, '_id'>;
