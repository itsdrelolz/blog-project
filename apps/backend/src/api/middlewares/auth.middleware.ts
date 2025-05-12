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
  console.log("AuthMiddleware START"); // Log: Middleware started
  try {
      const authHeader = req.headers.authorization;
      console.log("Authorization Header:", authHeader); // Log: Auth header value

      if (!authHeader) {
          console.log("No auth header - Unauthorized"); // Log: No header case
          throw new AuthError('No authorization token provided');
      }

      const [type, token] = authHeader.split(' ');
      console.log("Token Type:", type, "Token Value:", token); // Log: Token parts
      if (!token || type !== 'Bearer') {
          console.log("Invalid token format - Unauthorized"); // Log: Invalid format
          throw new AuthError('Invalid token format');
      }

      try {
          const decoded = jwt.verify(token, config.jwtSecret || '') as TokenPayload;
          console.log("Token Decoded:", decoded); // Log: Decoded payload
          req.user = {
              id: decoded.id,
              email: decoded.email,
          };
          console.log("AuthMiddleware SUCCESS - User attached to req.user"); // Log: Success
          next(); // Proceed to next handler
      } catch (jwtError) {
          console.log("JWT Verification Error:", jwtError); // Log: JWT error
          throw new AuthError('Invalid or expired token');
      }
  } catch (error) {
      if (error instanceof AuthError) {
          console.log("AuthError caught:", error.message); // Log: AuthError messages
          res.status(401).json({ error: error.message });
          return;
      }
      console.error("Generic Middleware Error:", error); // Log: Generic error
      res.status(500).json({ error: 'Internal server error' });
  }
  console.log("AuthMiddleware END"); // Log: Middleware finished
};
