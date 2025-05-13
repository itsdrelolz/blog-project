// src/services/auth.service.ts
import { PrismaClient, User } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {AuthResponse, TokenPayload} from '@blog-project/shared-types/types/auth';
import { CreateUserData, GetUserData } from '@blog-project/shared-types/types/user';
import config from '../config';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async createUser(userData: CreateUserData): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Get default role (e.g., 'user') if roleId is not provided
    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'user' }
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        roleId: userData.roleId || defaultRole.id,
      },
      include: {
        role: true
      }
    });

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as any,
      token,
    };
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    });

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword as any,
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
      include: {
        role: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            thumbnail: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        comments: {
          select: {
            id: true,
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
