import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

interface CustomError extends Error {
  status?: number;
  message: string;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  const knownError = err as CustomError;

  if (knownError.status && knownError.message) {
    return res.status(knownError.status).json({
      status: 'fail',
      message: knownError.message,
    });
  }

  console.error(err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};
