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
const client_1 = require("@prisma/client");
const post_services_1 = require("../../services/post.services");
class PostController {
    constructor(prisma) {
        this.postService = new post_services_1.PostService(prisma);
    }
    getPublishedPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.postService.findAll();
                return res.json({ posts });
            }
            catch (error) {
                console.error("Error getting published posts:", error);
                return res.status(500).json({ error: 'Failed to get posts' });
            }
        });
    }
    //get user only post 
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid post ID' });
                }
                const post = yield this.postService.findById(id);
                if (!post) {
                    return res.status(404).json({ error: 'Post not found' });
                }
                const canView = post.published ||
                    post.authorId === user.id ||
                    user.role === client_1.Role.ADMIN;
                if (!canView) {
                    return res.status(403).json({ error: 'Post not available' });
                }
                return res.json({ post });
            }
            catch (error) {
                console.error("Error getting post:", error);
                res.status(500).json({ error: 'Failed to get post' });
                return res.status(500).json({ error: 'Failed to get post' });
            }
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const { title, content } = req.body;
                if (!title || !content) {
                    return res.status(400).json({ error: 'Title and content are required' });
                }
                const post = yield this.postService.create(user.id, { title, content, published: false });
                return res.status(201).json({ post });
            }
            catch (error) {
                console.error('Error creating post:', error);
                return res.status(500).json({ error: 'Failed to create post' });
            }
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid post ID' });
                }
                const existingPost = yield this.postService.findById(id);
                if (!existingPost) {
                    return res.status(404).json({ error: 'Post not found' });
                }
                if (existingPost.authorId !== user.id && user.role !== client_1.Role.ADMIN) {
                    return res.status(403).json({ error: 'Not authorized to update this post' });
                }
                const post = yield this.postService.update(id, req.body);
                return res.json({ post });
            }
            catch (error) {
                console.error('Error updating post:', error);
                return res.status(500).json({ error: 'Failed to update post' });
            }
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = req.user;
                const id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return res.status(400).json({ error: 'Invalid post ID' });
                }
                const existingPost = yield this.postService.findById(id);
                if (!existingPost) {
                    return res.status(404).json({ error: 'Post not found' });
                }
                if (existingPost.authorId !== user.id && user.role !== client_1.Role.ADMIN) {
                    return res.status(403).json({ error: 'Not authorized to delete this post' });
                }
                yield this.postService.delete(id);
                return res.status(204).send();
            }
            catch (error) {
                console.error('Error deleting post:', error);
                return res.status(500).json({ error: 'Failed to delete post' });
            }
        });
    }
}
exports.default = PostController;
