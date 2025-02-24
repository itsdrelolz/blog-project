import { Router } from 'express';
import { commentValidators } from '../validators/comment.validator';
import CommentController from '../controllers/comments.controller';
import prisma from '../../lib/prisma';
import { postController } from './creator.routes';
import { Request, Response, NextFunction } from 'express';

const router = Router();

const commentsController = new CommentController(prisma);

// GET routes
router.get('/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await postController.getAllPublishedPosts(req, res);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get(
  '/posts/:postId/comments',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.getPostComments(req, res); // Get all comments for a post
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
      next(error);
    }
  },
);

router.get(
  '/posts/:postId/comments/:commentId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.getPostComment(req, res); // Get specific comment
    } catch (error) {
      console.error('Error fetching comment:', error);
      res.status(500).json({ error: 'Failed to fetch comment' });
      next(error);
    }
  },
);

// POST route
router.post(
  '/posts/:postId/comments',
  commentValidators.createComment,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.getPostComments(req, res);
    } catch (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
      next(error);
    }
  },
);

// PUT route
router.put(
  '/posts/:postId/comments/:commentId',
  commentValidators.updateComment,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.updateComment(req, res); // Update specific comment
    } catch (error) {
      console.error('Error updating comment:', error);
      res.status(500).json({ error: 'Failed to update comment' });
      next(error);
    }
  },
);

// DELETE route
router.delete(
  '/posts/:postId/comments/:commentId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.deleteComment(req, res); // Delete specific comment
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ error: 'Failed to delete comment' });
      next(error);
    }
  },
);

export default router;
