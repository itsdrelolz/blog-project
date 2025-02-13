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
Object.defineProperty(exports, "__esModule", { value: true });
const comment_services_1 = require("../../services/comment.services");
class CommentController {
    constructor(prisma) {
        this.commentService = new comment_services_1.CommentService(prisma);
    }
    addComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { content } = req.body;
                const postId = parseInt(req.params.postId);
                if (!content) {
                    return res.status(400).json({ error: 'Comment content is required' });
                }
                if (isNaN(postId)) {
                    return res.status(400).json({ error: 'Invalid post ID' });
                }
                const comment = yield this.commentService.createComment(user.id, {
                    content,
                    postId,
                });
                return res.status(201).json({ comment });
            }
            catch (error) {
                console.error('Error creating comment:', error);
                if (error instanceof Error && error.message === 'Post not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(500).json({ error: 'Failed creating a comment' });
            }
        });
    }
    getPostComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postId = parseInt(req.params.postId);
                const commentId = parseInt(req.params.commentId);
                if (isNaN(postId) || isNaN(commentId)) {
                    return res.status(400).json({ error: 'Invalid ID provided' });
                }
                const comment = yield this.commentService.getCommentById(commentId, postId);
                if (!comment) {
                    return res.status(404).json({ error: 'Comment not found' });
                }
                return res.json({ comment });
            }
            catch (error) {
                console.error('Error fetching comment:', error);
                if (error instanceof Error && error.message === 'Post not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(500).json({ error: 'Error fetching comment' });
            }
        });
    }
    getPostComments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postId = parseInt(req.params.postId);
                if (isNaN(postId)) {
                    return res.status(400).json({ error: 'Invalid post ID' });
                }
                const comments = yield this.commentService.getCommentsByPostId(postId);
                return res.json({ comments });
            }
            catch (error) {
                console.error('Error fetching comments:', error);
                if (error instanceof Error && error.message === 'Post not found') {
                    return res.status(404).json({ error: error.message });
                }
                return res.status(500).json({ error: 'Error fetching comments' });
            }
        });
    }
    updateComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postId = parseInt(req.params.postId);
                const commentId = parseInt(req.params.commentId);
                const { content } = req.body;
                if (!content || isNaN(postId) || isNaN(commentId)) {
                    return res.status(400).json({ error: 'Invalid request data' });
                }
                const comment = yield this.commentService.updateComment(commentId, postId, content, user.id, user.role);
                return res.json({ comment });
            }
            catch (error) {
                console.error('Error updating comment:', error);
                if (error instanceof Error) {
                    if (error.message === 'Comment not found') {
                        return res.status(404).json({ error: error.message });
                    }
                    if (error.message === 'Not authorized to update this comment') {
                        return res.status(403).json({ error: error.message });
                    }
                }
                return res.status(500).json({ error: 'Failed to update comment' });
            }
        });
    }
    deleteComment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const postId = parseInt(req.params.postId);
                const commentId = parseInt(req.params.commentId);
                if (isNaN(postId) || isNaN(commentId)) {
                    return res.status(400).json({ error: 'Invalid ID provided' });
                }
                yield this.commentService.deleteComment(commentId, postId, user.id, user.role);
                return res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting comment:', error);
                if (error instanceof Error) {
                    if (error.message === 'Comment not found') {
                        return res.status(404).json({ error: error.message });
                    }
                    if (error.message === 'Not authorized to delete this comment') {
                        return res.status(403).json({ error: error.message });
                    }
                }
                return res.status(500).json({ error: 'Failed to delete comment' });
            }
        });
    }
}
exports.default = CommentController;
