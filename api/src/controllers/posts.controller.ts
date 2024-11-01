import { PrismaClient } from '@prisma/client';
import type { Request, Response, RequestHandler } from 'express';

interface RequestUser {
  id: number;
  role: 'READER' | 'CREATOR' | 'ADMIN';
  email: string;
}




const prisma = new PrismaClient();

export const getAllPosts: RequestHandler = async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({
      error: 'Failed to fetch posts',
    });
  }
};

export const getPost: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
      });
      return;
    }

    if (!post.published) {
      res.status(403).json({
        error: 'Post not available',
      });
      return;
    }
    res.status(200).json({ post });
  } catch (error) {
    console.error(`Error fetching post ${error}`);
    res.status(500).json({
      error: 'Error fetching post',
    });
  }
};

export const getUserPosts: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json({ posts });
  } catch (error) {
    console.error(`Error fetching posts: ${error}`);
    res.status(500).json({
      error: 'Failed to fetch posts',
    });
  }
};

export const createPost: RequestHandler = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    if (!title) {
      res.status(400).json({
        error: 'Title is required',
      });
      return;
    }
    if (!content) {
      res.status(400).json({
        error: 'Content is required',
      });
      return;
    }
    const authorId = req.user.id;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({ post });
  } catch (error) {
    console.error(`Error creating post: ${error}`);
    res.status(500).json({
      error: 'Failed to create post',
    });
  }
};

export const updatePost: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { title, content, published } = req.body;

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    const existingPost = await prisma.post.findUnique({
      where: { id },
    });

    if (!existingPost) {
      res.status(404).json({
        error: 'Post not found',
      });
      return;
    }

    if (existingPost.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({
        error: 'Not authorized to update this post',
      });
      return;
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title || undefined,
        content: content || undefined,
        published: published === undefined ? undefined : published,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(200).json({ post });
  } catch (error) {
    console.error(`Error updating post: ${error}`);
    res.status(500).json({
      error: 'Failed to update post',
    });
  }
};

export const deletePost: RequestHandler = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({
        error: 'Invalid post ID',
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: 'User not authenticated',
      });
      return;
    }

    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      res.status(404).json({
        error: 'Post not found',
      });
      return;
    }

    if (post.authorId !== req.user.id && req.user.role !== 'ADMIN') {
      res.status(403).json({
        error: 'Not authorized to delete this post',
      });
      return;
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(`Error deleting post: ${error}`);
    res.status(500).json({
      error: 'Failed to delete post',
    });
  }
};

export default {
  getAllPosts,
  getPost,
  getUserPosts,
  createPost,
  updatePost,
  deletePost,
};