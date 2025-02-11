// src/services/post.service.ts
import { PrismaClient, Post } from '@prisma/client';
import { CreatePostData, UpdatePostData } from '../types';

export class PostService {
  constructor(private prisma: PrismaClient) {}

  async create(authorId: number, data: CreatePostData): Promise<Post> {
    return this.prisma.post.create({
      data: {
        ...data,
        authorId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });
  }

  async findById(id: number) {
    return this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async update(id: number, data: UpdatePostData) {
    return this.prisma.post.update({
      where: { id },
      data,
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async delete(id: number) {
    return this.prisma.post.delete({
      where: { id },
    });
  }

  async findByAuthorId(authorId: number) {
    return this.prisma.post.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
