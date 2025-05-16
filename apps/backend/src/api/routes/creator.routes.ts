import { Router } from 'express';
import { postValidators } from '../validators/post.validator';
import prisma from '../../lib/prisma';
import PostController from '../controllers/posts.controller';
import { Request, Response, NextFunction } from 'express';
import { uploadMiddleware } from '../middlewares/upload.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = Router();

export const postController = new PostController(prisma);

// allows only authors to create a post
router.post(
  '/posts',
  authMiddleware,
  requireRole(['author', 'admin']),
  postValidators.createPost,
  (req: Request, res: Response, next: NextFunction) => {
    postController.createPost(req, res).catch(error => {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
      next(error);
    });
  },
);

// allows authors to update their own posts
router.put(
  '/posts/:id',
  authMiddleware,
  requireRole(['author', 'admin']),
  postValidators.updatePost,
  (req: Request, res: Response, next: NextFunction) => {
    postController.updatePost(req, res).catch(error => {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
      next(error);
    });
  },
);

// allows authors to delete their own posts
router.delete(
  '/posts/:id',
  authMiddleware,
  requireRole(['author', 'admin']),
  (req: Request, res: Response, next: NextFunction) => {
    postController.deletePost(req, res).catch(error => {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
      next(error);
    });
  },
);

// allows authors to upload images for their posts
router.post(
  '/upload-image',
  authMiddleware,
  requireRole(['author', 'admin']),
  uploadMiddleware('image'),
  (req: Request, res: Response, next: NextFunction) => {
    postController.uploadImage(req, res).catch(error => {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
      next(error);
    });
  }
);

router.put(
  '/upload-image',
  authMiddleware,
  requireRole(['author', 'admin']),
  uploadMiddleware('image'),
  (req: Request, res: Response, next: NextFunction) => {
    postController.uploadImage(req, res).catch(error => {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Failed to upload image' });
      next(error);
    });
  }
);

export default router;
