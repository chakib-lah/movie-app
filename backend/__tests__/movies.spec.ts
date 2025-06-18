jest.setTimeout(30000);
process.env.NODE_ENV = 'test';

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { Movie } from '../src/models/movie.model.js';
import { User } from '../src/models/user.model.js';
import { getTestToken } from './utils/getTestToken.js';

let mongo: MongoMemoryServer;
let token: string;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
  token = await getTestToken();
});

afterEach(async () => {
  await Promise.all([
    Movie.deleteMany?.(), 
    User.deleteMany?.()
  ]);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe('Movies API', () => {
  it('should create a new movie', async () => {
    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Inception', director: 'Nolan', year: 2010 });

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Inception');
  });

  it('should return all movies', async () => {
    await Movie.create({ title: 'Inception', director: 'Nolan', year: 2010 });

    const res = await request(app)
      .get('/api/movies')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should return a movie by ID', async () => {
    const movie = await Movie.create({
      title: 'Test',
      director: 'X',
      year: 2000,
    });

    const res = await request(app)
      .get(`/api/movies/${movie._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(movie._id.toString());
  });

  it('should update a movie', async () => {
    const movie = await Movie.create({
      title: 'Old',
      director: 'X',
      year: 1990,
    });

    const res = await request(app)
      .put(`/api/movies/${movie._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('should delete a movie', async () => {
    const movie = await Movie.create({
      title: 'To Delete',
      director: 'Y',
      year: 2001,
    });

    const res = await request(app)
      .delete(`/api/movies/${movie._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });

  // UNAUTHORIZED tests
  it('should return 401 if no token provided (GET all)', async () => {
    const res = await request(app).get('/api/movies');
    expect(res.statusCode).toBe(401);
  });

  it('should return 401 for invalid token (POST)', async () => {
    const res = await request(app)
      .post('/api/movies')
      .set('Authorization', 'Bearer invalid.token.here')
      .send({ title: 'Fake', director: 'Nobody', year: 1999 });

    expect(res.statusCode).toBe(401);
  });
});
