import { Router } from "express";
import postsController from "../controllers/posts.controller";
import commentsController from "../controllers/comments.controller";
import { checkCreatorRole } from "../middleware/auth.middleware";
const router = Router();


/*
takes user to the dashboard where they can view all of their existing posts
*/

router.use(checkCreatorRole);
router.get("/dashboard", postsController.getUserPosts); 

// allows a user to create a post
router.post("/posts", postsController.createPost);
// allows a user to update a post
router.put("/:postId", postsController.updatePost);
// allows a user to delete a post
router.delete("/:postId", postsController.deletePost);



export default router;