import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const addComment: RequestHandler = async (req, res) => {
  try {
    const { content } = req.body;
    const postId = parseInt(req.params.postId);

    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    if (!content) {
      res.status(400).json({
        error: 'Comment content is required',
      });
      return;
    }

    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
      });
      return;
    }

    const authorId = req.user.id;

    // Create comment with post connection
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId,
        postId,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      comment,
    });
  } catch (error) {
    console.error(`Error creating comment: ${error}`);
    res.status(500).json({
      error: 'Failed creating a comment',
    });
  }
};

export const getPostComments: RequestHandler = async (req, res) => {};

export const getPostComment: RequestHandler = async (req, res) => {};

export const updateComment: RequestHandler = async (req, res) => {};

export const deleteComment: RequestHandler = async (req, res) => {};
