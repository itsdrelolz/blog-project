"use strict";
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
router.get('/dashboard', exports.postController.getUserPosts);
// allows a user to create a post
router.post('/posts', post_validator_1.postValidators.createPost, exports.postController.createPost);
// allows a user to update a post
router.put('/posts/:id', post_validator_1.postValidators.updatePost, exports.postController.updatePost);
// allows a user to delete a post
router.delete('/posts/:id', exports.postController.deletePost);
exports.default = router;
