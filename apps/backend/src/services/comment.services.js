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
exports.CommentService = void 0;
class CommentService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    createComment(authorId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.prisma.post.findUnique({
                where: { id: data.postId },
            });
            if (!post) {
                throw new Error('Post not found');
            }
            return this.prisma.comment.create({
                data: {
                    content: data.content,
                    authorId,
                    postId: data.postId,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
    getCommentById(commentId, postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.prisma.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new Error('Post not found');
            }
            const comment = yield this.prisma.comment.findFirst({
                where: {
                    id: commentId,
                    postId,
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
            });
            if (!comment) {
                return null;
            }
            return comment;
        });
    }
    getCommentsByPostId(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.prisma.post.findUnique({
                where: { id: postId },
            });
            if (!post) {
                throw new Error('Post not found');
            }
            return this.prisma.comment.findMany({
                where: { postId },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
        });
    }
    updateComment(commentId, postId, content, userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.prisma.comment.findFirst({
                where: {
                    id: commentId,
                    postId,
                },
            });
            if (!comment) {
                throw new Error('Comment not found');
            }
            if (comment.authorId !== userId && userRole !== 'ADMIN') {
                throw new Error('Not authorized to update this comment');
            }
            return this.prisma.comment.update({
                where: { id: commentId },
                data: { content },
                include: {
                    author: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
            });
        });
    }
    deleteComment(commentId, postId, userId, userRole) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.prisma.comment.findFirst({
                where: {
                    id: commentId,
                    postId,
                },
            });
            if (!comment) {
                throw new Error('Comment not found');
            }
            if (comment.authorId !== userId && userRole !== 'ADMIN') {
                throw new Error('Not authorized to delete this comment');
            }
            return this.prisma.comment.delete({
                where: { id: commentId },
            });
        });
    }
}
exports.CommentService = CommentService;
