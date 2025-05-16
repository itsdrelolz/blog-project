import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PostService } from '../../services/post.services';
import { StorageService } from '../../services/storage.service';
import { TokenPayload } from '../middlewares/auth.middleware';

class PostController {
  private postService: PostService;
  private storageService: StorageService;

  constructor(prisma: PrismaClient) {
    this.postService = new PostService(prisma);
    this.storageService = new StorageService();
  }

  public async getAllPublishedPosts(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 9;

      if (page < 1 || limit < 1) {
        return res.status(400).json({ error: 'Invalid pagination parameters' });
      }

      const result = await this.postService.findAllPublished(page, limit);
      return res.json(result);
    } catch (error) {
      console.error('Error getting all published posts:', error);
      return res.status(500).json({ error: 'Failed to get published posts' });
    }
  }

  public async getPostById(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.postId);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      const post = await this.postService.findById(id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      return res.json({ post });
    } catch (error) {
      console.error('Error getting post:', error);
      return res.status(500).json({ error: 'Failed to get post' });
    }
  }

  public async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const { title, content, thumbnail, published } = req.body;

      if (!title || !content) {
        return res
          .status(400)
          .json({ error: 'Title and content are required' });
      }

      const post = await this.postService.create({ title, content, thumbnail, published }, user.id);

      return res.status(201).json({ post });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  public async uploadImage(req: Request, res: Response): Promise<Response> {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const imageUrl = await this.storageService.uploadFile(file);
      return res.status(201).json({ imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }
  }

  public async updatePost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      const existingPost = await this.postService.findById(id);

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.authorId !== user.id) {
        return res
          .status(403)
          .json({ error: 'Not authorized to update this post' });
      }

      const { title, content, thumbnail, published } = req.body;
      const updateData: {
        title?: string;
        content?: string;
        thumbnail?: string;
        published?: boolean;
      } = { title, content, thumbnail, published };

      // Remove undefined values
      Object.keys(updateData).forEach(
        (key) => updateData[key as keyof typeof updateData] === undefined && delete updateData[key as keyof typeof updateData]
      );

      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: 'No valid fields to update' });
      }

      const post = await this.postService.update(id, updateData);
      return res.json({ post });
    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }

  public async deletePost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      const existingPost = await this.postService.findById(id);

      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }

      if (existingPost.authorId !== user.id) {
        return res
          .status(403)
          .json({ error: 'Not authorized to delete this post' });
      }

      // Delete the image from storage if it exists
      if (existingPost.thumbnail) {
        await this.storageService.deleteFile(existingPost.thumbnail);
      }

      await this.postService.delete(id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ error: 'Failed to delete post' });
    }
  }
}

export default PostController;
