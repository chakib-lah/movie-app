import request from 'supertest';
import app from '../../src/app.js';

/**
 * Creates and logs in a test user, returning a valid JWT access token.
 * Ignores errors on re-registration (e.g., "email already exists").
 */
export async function getTestToken(
  email = 'test@example.com',
  password = 'testpass'
): Promise<string> {
  try {
    await request(app).post('/api/auth/register').send({ email, password });
  } catch (err) {
    console.log(err);
  }

  const res = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return res.body.accessToken;
}
