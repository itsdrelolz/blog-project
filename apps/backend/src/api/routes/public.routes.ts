import express,{ Router } from 'express';
import { commentValidators } from '../validators/comment.validator';
import CommentController from '../controllers/comments.controller';
import prisma from '../../lib/prisma';
import { postController } from './creator.routes';
import { Request, Response } from 'express';
const router = Router();

const commentsController = new CommentController(prisma);

// GET routes
router.get('/home', async (req: Request, res: Response) => { 
  try { 
    await postController.getPosts(req, res);
  } catch (error) { 
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' }); 
  }
  });
  
router.get('/posts/:postId/comments', commentsController.getPostComments); // Get all comments for a post
router.get('/posts/:postId/comments/:commentId', commentsController.getPostComment); // Get specific comment



// POST route
router.post(
  '/posts/:postId/comments',
  commentValidators.createComment,
  commentsController.addComment,
);

// PUT route
router.put(
  '/posts/:postId/comments/:commentId',
  commentValidators.updateComment,
  commentsController.updateComment,
);

// DELETE route
router.delete(
  '/posts/:postId/comments/:commentId',
  commentsController.deleteComment,
);

export default router;
