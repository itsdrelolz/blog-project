import { Router } from 'express';
import { postValidators } from '../validators/post.validator';
import prisma from '../../lib/prisma';
import PostController from '../controllers/posts.controller';
import { Request, Response, NextFunction } from 'express';
const router = Router();

/*
takes user to the dashboard where they can view all of their existing posts
*/

export const postController = new PostController(prisma);

// router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await  postController.getUserPosts(req, res);
//     }
// }

// allows a user to create a post
router.post(
  '/posts',
  postValidators.createPost,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postController.createPost(req, res);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
      next(error);
    }
  },
);
// allows a user to update a post
router.put(
  '/posts/:id',
  postValidators.updatePost,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postController.updatePost(req, res);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
      next(error);
    }
  },
);
// allows a user to delete a post
router.delete(
  '/posts/:id',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await postController.deletePost(req, res);
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
      next(error);
    }
  },
);

export default router;
