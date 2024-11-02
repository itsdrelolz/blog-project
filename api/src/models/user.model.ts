import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export enum UserRole {
  ADMIN = 'ADMIN',
  CREATOR = 'CREATOR',
  READER = 'READER',
}

export interface RequestUser {
  id: number;
  role: UserRole;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface loginData {
  email: string;
  password: string;
  confirmPassword?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

export class UserModel {
  static async create(data: CreateUserData) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'READER',
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async verifyLogin(data: loginData) {
    const user = await this.findByEmail(data.email);

    if (!user) return null;

    const validPassword = await bcrypt.compare(data.password, user.password);

    if (!validPassword) return null;

    return user;
  }

  static async findAll() {
    return prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
  }
}
