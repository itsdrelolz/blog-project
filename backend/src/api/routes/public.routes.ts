import { Router } from 'express';
import {
  addComment,
  getPostComment,
  getPostComments,
  updateComment,
  deleteComment,
} from '../controllers/comments.controller';
import { commentValidators } from '../../utils/comment.validator';
import postsController from '../controllers/posts.controller';

const router = Router();

// GET routes
router.get('/home', postsController.getAllPosts); // Get all posts for homepage
router.get('/posts/:postId/comments', getPostComments); // Get all comments for a post
router.get('/posts/:postId/comments/:commentId', getPostComment); // Get specific comment

// POST route
router.post(
  '/posts/:postId/comments',
  commentValidators.createComment,
  addComment,
);

// PUT route
router.put(
  '/posts/:postId/comments/:commentId',
  commentValidators.updateComment,
  updateComment,
);

// DELETE route
router.delete('/posts/:postId/comments/:commentId', deleteComment);

export default router;
