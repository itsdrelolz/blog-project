// src/services/auth.service.ts
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { CreateUserData, AuthResponse, TokenPayload, GetUserData} from '../types';
import config from '../config';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async createUser(userData: CreateUserData): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      },
    });

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  private generateToken(user: User): string {
    const payload: TokenPayload = {
      id: user.id,
      email: user.email,
    };

    return jwt.sign(payload, config.jwtSecret || 'defaultSecret', {
      expiresIn: '24h',
    });
  }

  async getMe(userId: number): Promise<GetUserData | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    return user as GetUserData;
  }
}
