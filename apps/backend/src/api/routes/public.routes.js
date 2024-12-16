"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const comment_validator_1 = require("../validators/comment.validator");
const comments_controller_1 = __importDefault(require("../controllers/comments.controller"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const creator_routes_1 = require("./creator.routes");
const router = (0, express_1.Router)();
const commentsController = new comments_controller_1.default(prisma_1.default);
// GET routes
router.get('/home', creator_routes_1.postController.getAllPosts); // Get all posts for homepage
router.get('/posts/:postId/comments', commentsController.getPostComments); // Get all comments for a post
router.get('/posts/:postId/comments/:commentId', commentsController.getPostComment); // Get specific comment
// POST route
router.post('/posts/:postId/comments', comment_validator_1.commentValidators.createComment, commentsController.addComment);
// PUT route
router.put('/posts/:postId/comments/:commentId', comment_validator_1.commentValidators.updateComment, commentsController.updateComment);
// DELETE route
router.delete('/posts/:postId/comments/:commentId', commentsController.deleteComment);
exports.default = router;
