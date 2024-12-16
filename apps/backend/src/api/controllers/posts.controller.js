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
exports.PostController = void 0;
const client_1 = require("@prisma/client");
const post_services_1 = require("../../services/post.services");
class PostController {
    constructor(prisma) {
        this.getAllPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'User not authenticated',
                    });
                    return;
                }
                const user = req.user;
                const posts = yield this.postService.findAll();
                res.json({ posts });
            }
            catch (error) {
                console.error('Error fetching posts:', error);
                res.status(500).json({
                    error: 'Failed to fetch posts',
                });
            }
        });
        this.getUserPosts = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'User not authenticated',
                    });
                    return;
                }
                const user = req.user;
                const posts = yield this.postService.findByAuthorId(user.id);
                res.json({ posts });
            }
            catch (error) {
                console.error('Error fetching user posts:', error);
                res.status(500).json({
                    error: 'Failed to fetch posts',
                });
            }
        });
        this.getPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'User not authenticated',
                    });
                    return;
                }
                const user = req.user;
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        error: 'Invalid post ID',
                    });
                    return;
                }
                const post = yield this.postService.findById(id);
                if (!post) {
                    res.status(404).json({
                        error: 'Post not found',
                    });
                    return;
                }
                if (!post.published &&
                    post.authorId !== user.id &&
                    user.role !== client_1.Role.ADMIN) {
                    res.status(403).json({
                        error: 'Post not available',
                    });
                    return;
                }
                res.json({ post });
            }
            catch (error) {
                console.error('Error fetching post:', error);
                res.status(500).json({
                    error: 'Error fetching post',
                });
            }
        });
        this.createPost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'User not authenticated',
                    });
                    return;
                }
                const user = req.user;
                const { title, content } = req.body;
                if (!title || !content) {
                    res.status(400).json({
                        error: 'Title and content are required',
                    });
                    return;
                }
                const post = yield this.postService.create(user.id, {
                    title,
                    content,
                    published: false,
                });
                res.status(201).json({ post });
            }
            catch (error) {
                console.error('Error creating post:', error);
                res.status(500).json({
                    error: 'Failed to create post',
                });
            }
        });
        this.updatePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'User not authenticated',
                    });
                    return;
                }
                const user = req.user;
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        error: 'Invalid post ID',
                    });
                    return;
                }
                const existingPost = yield this.postService.findById(id);
                if (!existingPost) {
                    res.status(404).json({
                        error: 'Post not found',
                    });
                    return;
                }
                if (existingPost.authorId !== user.id &&
                    user.role !== client_1.Role.ADMIN) {
                    res.status(403).json({
                        error: 'Not authorized to update this post',
                    });
                    return;
                }
                const post = yield this.postService.update(id, req.body);
                res.json({ post });
            }
            catch (error) {
                console.error('Error updating post:', error);
                res.status(500).json({
                    error: 'Failed to update post',
                });
            }
        });
        this.deletePost = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({
                        error: 'User not authenticated',
                    });
                    return;
                }
                const user = req.user;
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    res.status(400).json({
                        error: 'Invalid post ID',
                    });
                    return;
                }
                const existingPost = yield this.postService.findById(id);
                if (!existingPost) {
                    res.status(404).json({
                        error: 'Post not found',
                    });
                    return;
                }
                if (existingPost.authorId !== user.id &&
                    user.role !== client_1.Role.ADMIN) {
                    res.status(403).json({
                        error: 'Not authorized to delete this post',
                    });
                    return;
                }
                yield this.postService.delete(id);
                res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting post:', error);
                res.status(500).json({
                    error: 'Failed to delete post',
                });
            }
        });
        this.postService = new post_services_1.PostService(prisma);
    }
}
exports.PostController = PostController;
exports.default = PostController;
