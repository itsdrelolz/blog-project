import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';




const prisma = new PrismaClient();


  export const getAllPosts =  async (_req: Request, res: Response): Promise<Response> => {
    try {
      const posts = await prisma.post.findMany({
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
      });
      return res.status(200).json({ posts });
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({
        error: 'Failed to fetch posts',
      });
    }
  }


  export const getPost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid post ID',
        });
      }

      const post = await prisma.post.findUnique({
        where: {
          id,
        },
        include: {
          author: {
            select: {
              email: true,
            },
          },
        },
      });
    

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      if (!post.published) {
        return res.status(403).json({
          error: 'Post not available',
        });
      }
      return res.status(200).json({
        post,
      });
    } catch (error) {
      console.error(`Error fetching post ${error}`);
      return res.status(500).json({
        error: 'Error fetching post',
      });
    }
  }

  export const getUserPosts = async (req: Request, res: Response): Promise<Response> => {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      const posts = await prisma.post.findMany({
        where: {
          authorId: userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return res.status(200).json({ posts });
    } catch (error) {
      console.error(`Error fetching posts: ${error}`);
      return res.status(500).json({
        error: 'Failed to fetch posts',
      });
    }
  }

  export const createPost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const { title, content } = req.body;

      if (!req.user) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      if (!title) {
        return res.status(400).json({
          error: 'Title is required',
        });
      }
      if (!content) {
        return res.status(400).json({
          error: 'Content is required',
        });
      }
      const authorId = req.user.id;

      const post = await prisma.post.create({
        data: {
          title,
          content,
          authorId,
        },
      });

      return res.status(201).json({
        post,
      });
    } catch (error) {
      console.error(`Error creating post: ${error}`);
      return res.status(500).json({
        error: 'Failed to create post',
      });
    }
  }

  export const updatePost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt(req.params.id);
      const { title, content, published } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid post ID',
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      // Check if post exists and user is the author
      const existingPost = await prisma.post.findUnique({
        where: { id },
      });

      if (!existingPost) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Not authorized to update this post',
        });
      }

      const post = await prisma.post.update({
        where: { id },
        data: {
          title: title || undefined,
          content: content || undefined,
          published: published === undefined ? undefined : published,
        },
      });

      return res.status(200).json({ post });
    } catch (error) {
      console.error(`Error updating post: ${error}`);
      return res.status(500).json({
        error: 'Failed to update post',
      });
    }
  }

  export const deletePost = async (req: Request, res: Response): Promise<Response> => {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          error: 'Invalid post ID',
        });
      }

      if (!req.user) {
        return res.status(401).json({
          error: 'User not authenticated',
        });
      }

      // Check if post exists and user is the author
      const post = await prisma.post.findUnique({
        where: { id },
      });

      if (!post) {
        return res.status(404).json({
          error: 'Post not found',
        });
      }

      if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          error: 'Not authorized to delete this post',
        });
      }

      await prisma.post.delete({
        where: { id },
      });

      return res.status(204).send();
    } catch (error) {
      console.error(`Error deleting post: ${error}`);
      return res.status(500).json({
        error: 'Failed to delete post',
      });
    }
  }

  export const postsController = {
  getAllPosts,
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
};
