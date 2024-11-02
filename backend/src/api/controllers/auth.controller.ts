import { PrismaClient } from '@prisma/client';
import { UserModel } from '../../models/user.model';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import type { RequestHandler } from 'express'; // Add this import
import { CreateUserData, loginData } from '../../models/user.model';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || ' ';

const authController = {
  signup: (async (req: Request<{}, {}, CreateUserData>, res: Response) => {
    try {
      const { email, password, name } = req.body;

      if (!email || !password || !name) {
        res.status(400).json({
          error: 'Missing required fields',
        });
        return;
      }

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        res.status(400).json({
          error: 'User with this email already exists',
        });
        return;
      }

      const user = await UserModel.create({
        email,
        password,
        name,
      });

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        {
          expiresIn: '24h',
        },
      );

      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error(`Signup error: ${error}`);
      res.status(500).json({
        error: 'Internal server error during signup',
      });
    }
  }) as RequestHandler,

  login: (async (req: Request<{}, {}, loginData>, res: Response) => {
    try {
      const { email, password, confirmPassword } = req.body;

      if (!email || !password || !confirmPassword) {
        res.status(400).json({
          error: 'Email, password, and password confirmation are required',
        });
        return;
      }

      if (password !== confirmPassword) {
        res.status(400).json({
          error: 'Passwords do not match',
        });
        return;
      }

      const user = await UserModel.verifyLogin({ email, password });

      if (!user) {
        res.status(401).json({
          error: 'Invalid credentials',
        });
        return;
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role,
        },
        JWT_SECRET,
        { expiresIn: '24h' },
      );

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        user: userWithoutPassword,
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        error: 'Internal server error during login',
      });
    }
  }) as RequestHandler,
};

export default authController;
