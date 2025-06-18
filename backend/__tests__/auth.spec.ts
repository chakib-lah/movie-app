jest.setTimeout(30000);
process.env.NODE_ENV = 'test'; // make app.ts skip real DB connection

import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import bcrypt from 'bcrypt';
import app from '../src/app.js';
import { User } from '../src/models/user.model.js';

let mongo: MongoMemoryServer;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.disconnect(); // ensure no open connections
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe('Auth API', () => {
  it('should register a new user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registred');
  });

  it('should login and receive tokens', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ email: 'test@example.com', password: hashed });

    const res = await request(app).post('/api/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('should fail to login with wrong password', async () => {
    const hashed = await bcrypt.hash('password123', 10);
    await User.create({ email: 'wrong@example.com', password: hashed });

    const res = await request(app).post('/api/auth/login').send({
      email: 'wrong@example.com',
      password: 'wrongpass',
    });

    expect(res.statusCode).toBe(400);
  });

  it('should logout the user', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Logged out');
  });
});
