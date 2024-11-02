import { Router } from 'express';
import { 
  getAllPosts, 
  getPost, 
  getUserPosts, 
  createPost, 
  updatePost, 
  deletePost 
} from '../controllers/posts.controller';
import { checkCreatorRole } from '../middleware/auth.middleware';
import { postValidators } from '../utils/post.validator';
const router = Router();

/*
takes user to the dashboard where they can view all of their existing posts
*/

router.use(checkCreatorRole);
router.get('/dashboard', getUserPosts);

// allows a user to create a post
router.post('/posts', postValidators.createPost, createPost);
// allows a user to update a post
router.put('/posts/:id', postValidators.updatePost, updatePost);
// allows a user to delete a post
router.delete('/posts/:id', deletePost);

export default router;
