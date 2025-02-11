"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postController = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const post_validator_1 = require("../validators/post.validator");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const posts_controller_1 = __importDefault(require("../controllers/posts.controller"));
const router = (0, express_1.Router)();
/*
takes user to the dashboard where they can view all of their existing posts
*/
exports.postController = new posts_controller_1.default(prisma_1.default);
router.use(auth_middleware_1.checkCreatorRole);
// router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => { 
//     try { 
//         await  postController.getUserPosts(req, res);
//     }
// }
// allows a user to create a post
router.post('/posts', post_validator_1.postValidators.createPost, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.postController.createPost(req, res);
    }
    catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
        next(error);
    }
}));
// allows a user to update a post
router.put('/posts/:id', post_validator_1.postValidators.updatePost, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.postController.updatePost(req, res);
    }
    catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
        next(error);
    }
}));
// allows a user to delete a post
router.delete('/posts/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield exports.postController.deletePost(req, res);
    }
    catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
        next(error);
    }
}));
exports.default = router;
