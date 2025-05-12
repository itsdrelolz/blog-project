import { PrismaClient, Role } from '@prisma/client';
import { CreateRoleData, UpdateRoleData } from '../types/role';

export class RoleService {
  constructor(private prisma: PrismaClient) {}

  async createRole(data: CreateRoleData): Promise<Role> {
    return this.prisma.role.create({
      data,
    });
  }

  async findByName(name: string): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async findById(id: number): Promise<Role | null> {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async updateRole(id: number, data: UpdateRoleData): Promise<Role> {
    return this.prisma.role.update({
      where: { id },
      data,
    });
  }

  async deleteRole(id: number): Promise<Role> {
    return this.prisma.role.delete({
      where: { id },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return this.prisma.role.findMany();
  }
} 