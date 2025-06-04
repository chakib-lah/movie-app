import { Request } from 'express';

export interface RefreshTokenRequest extends Request {
  cookies: {
    refreshToken?: string;
  };
}
