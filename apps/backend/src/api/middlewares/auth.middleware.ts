import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import config from '../../config';

// Type declarations
declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
  }
}

export interface TokenPayload {
  id: number;
  email: string;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new AuthError('No authorization token provided');
    }

    const [type, token] = authHeader.split(' ');
    if (!token || type !== 'Bearer') {
      throw new AuthError('Invalid token format');
    }

    try {
      const decoded = jwt.verify(token, config.jwtSecret || '') as TokenPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email,
      };
      next();
    } catch (jwtError) {
      throw new AuthError('Invalid or expired token');
    }
  } catch (error) {
    if (error instanceof AuthError) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
