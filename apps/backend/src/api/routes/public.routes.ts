import { Router } from 'express';
import { commentValidators } from '../validators/comment.validator';
import CommentController from '../controllers/comments.controller';
import prisma from '../../lib/prisma';
import { postController } from './creator.routes';
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { TokenPayload } from '@blog-project/shared-types/types/auth';

const router = Router();

const commentsController = new CommentController(prisma);

// GET routes
router.get('/posts/search', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await postController.searchPosts(req, res);
  } catch (error) {
    console.error('Error searching posts:', error);
    res.status(500).json({ error: 'Failed to search posts' });
  }
});

router.get('/posts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await postController.getAllPublishedPosts(req, res);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get(
  '/posts/:postId',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postController.getPostById(req, res);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
      next(error);
    }
  },
);

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
  authMiddleware,
  commentValidators.createComment,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await commentsController.addComment(req, res);
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ error: 'Failed to create comment' });
      next(error);
    }
  },
);


// DELETE route
router.delete(
  '/posts/:postId/comments/:commentId',
  authMiddleware,
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
