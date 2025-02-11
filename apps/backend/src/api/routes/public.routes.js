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
const express_1 = require("express");
const comment_validator_1 = require("../validators/comment.validator");
const comments_controller_1 = __importDefault(require("../controllers/comments.controller"));
const prisma_1 = __importDefault(require("../../lib/prisma"));
const creator_routes_1 = require("./creator.routes");
const router = (0, express_1.Router)();
const commentsController = new comments_controller_1.default(prisma_1.default);
// GET routes
router.get('/home', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield creator_routes_1.postController.getPublishedPosts(req, res);
    }
    catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Failed to fetch posts' });
        next(error);
    }
}));
router.get('/posts/:postId/comments', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield commentsController.getPostComments(req, res);
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
        next(error);
    }
}));
router.get('/posts/:postId/comments/:commentId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield commentsController.getPostComment(req, res); // Get specific comment
    }
    catch (error) {
        console.error('Error fetching comment:', error);
        res.status(500).json({ error: 'Failed to fetch comment' });
        next(error);
    }
}));
// POST route
router.post('/posts/:postId/comments', comment_validator_1.commentValidators.createComment, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield commentsController.addComment(req, res);
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
        next(error);
    }
}));
// PUT route
router.put('/posts/:postId/comments/:commentId', comment_validator_1.commentValidators.updateComment, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield commentsController.updateComment(req, res);
    }
    catch (error) {
        console.error('Error updating comment:', error);
        res.status(500).json({ error: 'Failed to update comment' });
        next(error);
    }
}));
// DELETE route
router.delete('/posts/:postId/comments/:commentId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield commentsController.deleteComment(req, res);
    }
    catch (error) {
        console.error('Error deleting comment', error);
        res.status(500).json({ error: 'Failed to delete comment' });
        next(error);
    }
}));
exports.default = router;
