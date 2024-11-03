import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../../services/auth.services';
import { CreateUserData, LoginData, AuthResponse } from '../../types';
import { ParamsDictionary } from 'express-serve-static-core';

export class AuthController {
  private authService: AuthService;

  constructor(prisma: PrismaClient) {
    this.authService = new AuthService(prisma);
  }

  signup: RequestHandler<
    ParamsDictionary,
    AuthResponse | { error: string },
    CreateUserData
  > = async (req, res): Promise<void> => {
    try {
      const { email, password, name } = req.body;

      // Validation
      if (!email || !password || !name) {
        res.status(400).json({
          error: 'Missing required fields',
        });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          error: 'Password must be at least 6 characters long',
        });
        return;
      }

      const result = await this.authService.createUser({
        email,
        password,
        name,
      });

      res.status(201).json(result);
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists') {
        res.status(400).json({
          error: error.message,
        });
        return;
      }

      console.error('Signup error:', error);
      res.status(500).json({
        error: 'Internal server error during signup',
      });
    }
  };

  login: RequestHandler<
    ParamsDictionary,
    AuthResponse | { error: string },
    LoginData
  > = async (req, res): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          error: 'Email and password are required',
        });
        return;
      }

      const result = await this.authService.login(email, password);

      if (!result) {
        res.status(401).json({
          error: 'Invalid credentials',
        });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error during login',
      });
    }
  };
}

export default AuthController;
