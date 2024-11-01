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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsController = exports.deletePost = exports.updatePost = exports.createPost = exports.getUserPosts = exports.getPost = exports.getAllPosts = void 0;
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
var getAllPosts = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var posts, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.post.findMany({
                        where: {
                            published: true,
                        },
                        include: {
                            author: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    })];
            case 1:
                posts = _a.sent();
                return [2 /*return*/, res.status(200).json({ posts: posts })];
            case 2:
                error_1 = _a.sent();
                console.error('Error fetching posts:', error_1);
                return [2 /*return*/, res.status(500).json({
                        error: 'Failed to fetch posts',
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAllPosts = getAllPosts;
var getPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid post ID',
                        })];
                }
                return [4 /*yield*/, prisma.post.findUnique({
                        where: {
                            id: id,
                        },
                        include: {
                            author: {
                                select: {
                                    email: true,
                                },
                            },
                        },
                    })];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({
                            error: 'Post not found',
                        })];
                }
                if (!post.published) {
                    return [2 /*return*/, res.status(403).json({
                            error: 'Post not available',
                        })];
                }
                return [2 /*return*/, res.status(200).json({
                        post: post,
                    })];
            case 2:
                error_2 = _a.sent();
                console.error("Error fetching post ".concat(error_2));
                return [2 /*return*/, res.status(500).json({
                        error: 'Error fetching post',
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPost = getPost;
var getUserPosts = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var userId, posts, error_3;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
                if (!userId) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'User not authenticated',
                        })];
                }
                return [4 /*yield*/, prisma.post.findMany({
                        where: {
                            authorId: userId,
                        },
                        orderBy: {
                            createdAt: 'desc',
                        },
                    })];
            case 1:
                posts = _b.sent();
                return [2 /*return*/, res.status(200).json({ posts: posts })];
            case 2:
                error_3 = _b.sent();
                console.error("Error fetching posts: ".concat(error_3));
                return [2 /*return*/, res.status(500).json({
                        error: 'Failed to fetch posts',
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserPosts = getUserPosts;
var createPost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, title, content, authorId, post, error_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, title = _a.title, content = _a.content;
                if (!req.user) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'User not authenticated',
                        })];
                }
                if (!title) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Title is required',
                        })];
                }
                if (!content) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Content is required',
                        })];
                }
                authorId = req.user.id;
                return [4 /*yield*/, prisma.post.create({
                        data: {
                            title: title,
                            content: content,
                            authorId: authorId,
                        },
                    })];
            case 1:
                post = _b.sent();
                return [2 /*return*/, res.status(201).json({
                        post: post,
                    })];
            case 2:
                error_4 = _b.sent();
                console.error("Error creating post: ".concat(error_4));
                return [2 /*return*/, res.status(500).json({
                        error: 'Failed to create post',
                    })];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.createPost = createPost;
var updatePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, title, content, published, existingPost, post, error_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                _a = req.body, title = _a.title, content = _a.content, published = _a.published;
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid post ID',
                        })];
                }
                if (!req.user) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'User not authenticated',
                        })];
                }
                return [4 /*yield*/, prisma.post.findUnique({
                        where: { id: id },
                    })];
            case 1:
                existingPost = _b.sent();
                if (!existingPost) {
                    return [2 /*return*/, res.status(404).json({
                            error: 'Post not found',
                        })];
                }
                if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
                    return [2 /*return*/, res.status(403).json({
                            error: 'Not authorized to update this post',
                        })];
                }
                return [4 /*yield*/, prisma.post.update({
                        where: { id: id },
                        data: {
                            title: title || undefined,
                            content: content || undefined,
                            published: published === undefined ? undefined : published,
                        },
                    })];
            case 2:
                post = _b.sent();
                return [2 /*return*/, res.status(200).json({ post: post })];
            case 3:
                error_5 = _b.sent();
                console.error("Error updating post: ".concat(error_5));
                return [2 /*return*/, res.status(500).json({
                        error: 'Failed to update post',
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePost = updatePost;
var deletePost = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, post, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                id = parseInt(req.params.id);
                if (isNaN(id)) {
                    return [2 /*return*/, res.status(400).json({
                            error: 'Invalid post ID',
                        })];
                }
                if (!req.user) {
                    return [2 /*return*/, res.status(401).json({
                            error: 'User not authenticated',
                        })];
                }
                return [4 /*yield*/, prisma.post.findUnique({
                        where: { id: id },
                    })];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({
                            error: 'Post not found',
                        })];
                }
                if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
                    return [2 /*return*/, res.status(403).json({
                            error: 'Not authorized to delete this post',
                        })];
                }
                return [4 /*yield*/, prisma.post.delete({
                        where: { id: id },
                    })];
            case 2:
                _a.sent();
                return [2 /*return*/, res.status(204).send()];
            case 3:
                error_6 = _a.sent();
                console.error("Error deleting post: ".concat(error_6));
                return [2 /*return*/, res.status(500).json({
                        error: 'Failed to delete post',
                    })];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.deletePost = deletePost;
exports.postsController = {
    getAllPosts: exports.getAllPosts,
    getPost: exports.getPost,
    getUserPosts: exports.getUserPosts,
    createPost: exports.createPost,
    updatePost: exports.updatePost,
    deletePost: exports.deletePost,
};
