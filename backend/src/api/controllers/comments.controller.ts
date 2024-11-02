import { PrismaClient } from '@prisma/client';
import type { RequestHandler } from 'express';

const prisma = new PrismaClient();

export const addComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

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

export const getPostComments: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }
    const postId = parseInt(req.params.postId);

    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
      });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json({
      comments,
    });
  } catch (error) {
    console.error(`Error fetching comments: ${error}`);
    res.status(500).json({
      error: 'Error fetching comments',
    });
  }
};

export const getPostComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }
    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);

    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    if (isNaN(commentId)) {
      res.status(400).json({
        error: 'Invalid comment ID',
      });
      return;
    }

    const comment = await prisma.comment.findFirst({
      where: { id: commentId, postId: postId },
      include: {
        author: {
          select: {
            email: true, //include email with comment information
          },
        },
      },
    });

    if (!comment) {
      res.status(404).json({
        error: 'Comment not found',
      });
      return;
    }

    res.status(200).json({
      comment,
    });
  } catch (error) {
    console.error(`Error fetching comment: ${error}`);
    res.status(500).json({
      error: 'Error fetching comment',
    });
  }
};

export const updateComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);
    const { content } = req.body;

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

    if (isNaN(commentId)) {
      res.status(400).json({
        error: 'Invalid comment ID',
      });
      return;
    }

    // Find the comment and verify it exists
    const existingComment = await prisma.comment.findFirst({
      where: {
        id: commentId,
        postId: postId,
      },
    });

    if (!existingComment) {
      res.status(404).json({
        error: 'Comment not found',
      });
      return;
    }

    // Check if user is authorized to update the comment
    if (existingComment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({
        error: 'Not authorized to update this comment',
      });
      return;
    }

    // Update the comment
    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
      include: {
        author: {
          select: {
            email: true,
          },
        },
      },
    });

    res.status(200).json({
      comment: updatedComment,
    });
  } catch (error) {
    console.error(`Error updating comment: ${error}`);
    res.status(500).json({
      error: 'Failed to update comment',
    });
  }
};

export const deleteComment: RequestHandler = async (req, res) => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    const postId = parseInt(req.params.postId);
    const commentId = parseInt(req.params.commentId);

    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    if (isNaN(commentId)) {
      res.status(400).json({
        error: 'Invalid comment ID',
      });
      return;
    }

    const comment = await prisma.comment.findFirst({
      where: { id: commentId, postId: postId },
      include: {
        author: {
          select: {
            email: true, //include email with comment information
          },
        },
      },
    });

    if (!comment) {
      res.status(404).json({
        error: 'Comment not found',
      });
      return;
    }

    if (comment.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({
        error: 'Not authorized to delete this comment',
      });
      return;
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting comment: ${error}`);
    res.status(500).json({
      error: 'Failed to delete comment',
    });
  }
};
