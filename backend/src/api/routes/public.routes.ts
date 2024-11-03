import { Router } from 'express';
import { commentValidators } from '../validators/comment.validator';
import CommentController from '../controllers/comments.controller';
import prisma from '../../lib/prisma';
import { postController } from './creator.routes';
const router = Router();

const commentsController = new CommentController(prisma);
// GET routes
router.get('/home', postController.getAllPosts); // Get all posts for homepage
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
