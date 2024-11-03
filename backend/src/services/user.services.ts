// src/services/user.service.ts
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CreateUserData, LoginData } from '../types';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: data.role || 'READER',
      },
    });
  }

  async login(data: LoginData): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(id: number, data: Partial<CreateUserData>): Promise<User> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
