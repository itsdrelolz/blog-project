import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';

const prisma = new PrismaClient();

const commentsController = {
  addComment: async (req: Request, res: Response) => {
    try {
      const { content, postId } = req.body;

      if (!content) {
        return res.status(400).json({
          error: 'Comment content is required',
        });
      }

      if (!postId) {
        return res.status(400).json({
          error: 'Post ID is required',
        });
      }

      const post = await prisma.post.findUnique({
        where: { id: postId },
      });

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      const authorId = req.user.id;

      // Create comment with post connection
      const comment = await prisma.comment.create({
        data: {
          content,
          authorId,
          postId, // Connect to the post
        },
        include: {
          author: {
            select: {
              email: true,
            },
          },
        },
      });
      return res.status(201).json({
        comment,
      });
    } catch (error) {
      console.error(`Error creating comment: ${error}`);
      return res.status(500).json({
        error: 'Failed creating a comment',
      });
    }
  },
};

export default commentsController;
