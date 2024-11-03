import { Router } from 'express';
import { checkCreatorRole } from '../middlewares/auth.middleware';
import { postValidators } from '../validators/post.validator';
import prisma from '../../lib/prisma';
import PostController from '../controllers/posts.controller';
const router = Router();

/*
takes user to the dashboard where they can view all of their existing posts
*/

export const postController = new PostController(prisma);

router.use(checkCreatorRole);
router.get('/dashboard', postController.getUserPosts);

// allows a user to create a post
router.post('/posts', postValidators.createPost, postController.createPost);
// allows a user to update a post
router.put('/posts/:id', postValidators.updatePost, postController.updatePost);
// allows a user to delete a post
router.delete('/posts/:id', postController.deletePost);

export default router;
