"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var posts_controller_1 = require("../controllers/posts.controller");
var auth_middleware_1 = require("../middleware/auth.middleware");
var post_validator_1 = require("../utils/post.validator");
var router = (0, express_1.Router)();
/*
takes user to the dashboard where they can view all of their existing posts
*/
router.use(auth_middleware_1.checkCreatorRole);
router.get('/dashboard', posts_controller_1.getUserPosts);
// allows a user to create a post
router.post('/posts', post_validator_1.postValidators.createPost, posts_controller_1.createPost);
// allows a user to update a post
router.put('/:postId', post_validator_1.postValidators.updatePost, posts_controller_1.updatePost);
// allows a user to delete a post
router.delete('/:postId', posts_controller_1.deletePost);
exports.default = router;
