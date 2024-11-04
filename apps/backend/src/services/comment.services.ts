import { PrismaClient, Comment } from '@prisma/client';
import { CreateCommentData } from '../types';

export class CommentService {
  constructor(private prisma: PrismaClient) {}

  async createComment(authorId: number, data: CreateCommentData) {
    const post = await this.prisma.post.findUnique({
      where: { id: data.postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return this.prisma.comment.create({
      data: {
        content: data.content,
        authorId,
        postId: data.postId,
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

  async getCommentById(commentId: number, postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
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

    if (!comment) {
      return null;
    }

    return comment;
  }

  async getCommentsByPostId(postId: number) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return this.prisma.comment.findMany({
      where: { postId },
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
    });
  }

  async updateComment(
    commentId: number,
    postId: number,
    content: string,
    userId: number,
    userRole: string,
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== userId && userRole !== 'ADMIN') {
      throw new Error('Not authorized to update this comment');
    }

    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content },
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

  async deleteComment(
    commentId: number,
    postId: number,
    userId: number,
    userRole: string,
  ) {
    const comment = await this.prisma.comment.findFirst({
      where: {
        id: commentId,
        postId,
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (comment.authorId !== userId && userRole !== 'ADMIN') {
      throw new Error('Not authorized to delete this comment');
    }

    return this.prisma.comment.delete({
      where: { id: commentId },
    });
  }
}