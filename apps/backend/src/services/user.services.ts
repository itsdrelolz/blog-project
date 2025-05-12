// src/services/user.service.ts
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { CreateUserData, LoginData } from '../types';

export class UserService {
  constructor(private prisma: PrismaClient) {}

  async createUser(data: CreateUserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Get default role (e.g., 'user') if roleId is not provided
    const defaultRole = await this.prisma.role.findFirst({
      where: { name: 'user' }
    });

    if (!defaultRole) {
      throw new Error('Default role not found');
    }

    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: {
          connect: {
            id: data.roleId || defaultRole.id
          }
        }
      },
      include: {
        role: true
      }
    });
  }

  async login(data: LoginData): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      include: {
        role: true
      }
    });

    if (!user) return null;

    const isValidPassword = await bcrypt.compare(data.password, user.password);
    if (!isValidPassword) return null;

    return user;
  }

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true
      }
    });
  }

  async updateUser(id: number, data: Partial<CreateUserData>): Promise<User> {
    const updateData: any = { ...data };
    
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.roleId) {
      updateData.role = {
        connect: {
          id: data.roleId
        }
      };
      delete updateData.roleId;
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        role: true
      }
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
      include: {
        role: true
      }
    });
  }
}
