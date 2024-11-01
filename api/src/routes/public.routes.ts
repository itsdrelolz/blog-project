import { Router } from 'express';
import commentsController from '../controllers/comments.controller';
import { commentValidators } from '../utils/comment.validator';
import { appendFile } from 'fs';
import postsController from '../controllers/posts.controller';
const router = Router();

router.get("/", postsController.getAllPosts);

export default router;