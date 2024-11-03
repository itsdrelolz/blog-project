import { RequestHandler } from 'express';
import { PrismaClient, Role, User } from '@prisma/client';
import { PostService } from '../../services/post.services';
import { CreatePostData, UpdatePostData } from '../../types';
import { ParamsDictionary } from 'express-serve-static-core';

export class PostController {
  private postService: PostService;

  constructor(prisma: PrismaClient) {
    this.postService = new PostService(prisma);
  }

  getAllPosts: RequestHandler<
    ParamsDictionary,
    { posts: any[] } | { error: string }
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
        });
        return;
      }

      const user = req.user as User;
      const posts = await this.postService.findAll();
      res.json({ posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({
        error: 'Failed to fetch posts',
      });
    }
  };


  getUserPosts: RequestHandler<
    ParamsDictionary,
    { posts: any[] } | { error: string }
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
        });
        return;
      }

      const user = req.user as User;
      const posts = await this.postService.findByAuthorId(user.id);
      res.json({ posts });
    } catch (error) {
      console.error('Error fetching user posts:', error);
      res.status(500).json({
        error: 'Failed to fetch posts',
      });
    }
  };

  getPost: RequestHandler<
    { id: string },
    { post: any } | { error: string }
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
        });
        return;
      }

      const user = req.user as User;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid post ID',
        });
        return;
      }

      const post = await this.postService.findById(id);
      if (!post) {
        res.status(404).json({
          error: 'Post not found',
        });
        return;
      }

      if (
        !post.published &&
        post.authorId !== user.id &&
        user.role !== Role.ADMIN
      ) {
        res.status(403).json({
          error: 'Post not available',
        });
        return;
      }

      res.json({ post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({
        error: 'Error fetching post',
      });
    }
  };

  createPost: RequestHandler<
    ParamsDictionary,
    { post: any } | { error: string },
    CreatePostData
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
        });
        return;
      }

      const user = req.user as User;
      const { title, content } = req.body;

      if (!title || !content) {
        res.status(400).json({
          error: 'Title and content are required',
        });
        return;
      }

      const post = await this.postService.create(user.id, {
        title,
        content,
        published: false,
      });

      res.status(201).json({ post });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({
        error: 'Failed to create post',
      });
    }
  };

  updatePost: RequestHandler<
    { id: string },
    { post: any } | { error: string },
    UpdatePostData
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
        });
        return;
      }

      const user = req.user as User;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid post ID',
        });
        return;
      }

      const existingPost = await this.postService.findById(id);
      if (!existingPost) {
        res.status(404).json({
          error: 'Post not found',
        });
        return;
      }

      if (
        existingPost.authorId !== user.id &&
        user.role !== Role.ADMIN
      ) {
        res.status(403).json({
          error: 'Not authorized to update this post',
        });
        return;
      }

      const post = await this.postService.update(id, req.body);
      res.json({ post });
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({
        error: 'Failed to update post',
      });
    }
  };

  deletePost: RequestHandler<
    { id: string },
    { error: string } | {}
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          error: 'User not authenticated',
        });
        return;
      }

      const user = req.user as User;
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({
          error: 'Invalid post ID',
        });
        return;
      }

      const existingPost = await this.postService.findById(id);
      if (!existingPost) {
        res.status(404).json({
          error: 'Post not found',
        });
        return;
      }

      if (
        existingPost.authorId !== user.id &&
        user.role !== Role.ADMIN
      ) {
        res.status(403).json({
          error: 'Not authorized to delete this post',
        });
        return;
      }

      await this.postService.delete(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({
        error: 'Failed to delete post',
      });
    }
  };
}

export default PostController;