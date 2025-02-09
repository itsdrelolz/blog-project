import { Request, Response } from 'express';
import { PrismaClient, Role } from '@prisma/client';
import { User } from '@prisma/client';
import { PostService } from '../../services/post.services';



class PostController {
  private postService: PostService;

  constructor(prisma: PrismaClient) {
    this.postService = new PostService(prisma);
  }


  public async getPost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as User;
      const id = parseInt(req.params.id);


      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }


      const post = await this.postService.findById(id);


      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }


      const canView =
        post.published ||
        post.authorId === user.id ||
        user.role === Role.ADMIN;


      if (!canView) {
        return res.status(403).json({ error: 'Post not available' });
      }


      return res.json({ post });


    } catch (error) {
      console.error("Error getting post:", error);
      res.status(500).json({ error: 'Failed to get post' });
      return res.status(500).json({ error: 'Failed to get post' });
    }
  }


  public async createPost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as User;
      const { title, content } = req.body;
 
      if (!title ||!content) {
        return res.status(400).json({ error: 'Title and content are required' });
      }
 
      const post = await this.postService.create(user.id, { title, content, published: false });
 
      return res.status(201).json({ post });
 
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }


  public async updatePost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as User;
      const id = parseInt(req.params.id);


      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }


      const existingPost = await this.postService.findById(id);


      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }


      if (existingPost.authorId !== user.id && user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Not authorized to update this post' });
      }


      const post = await this.postService.update(id, req.body);
      return res.json({ post });


    } catch (error) {
      console.error('Error updating post:', error);
      return res.status(500).json({ error: 'Failed to update post' });
    }
  }


  public async deletePost(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as User;
      const id = parseInt(req.params.id);


      if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }


      const existingPost = await this.postService.findById(id);


      if (!existingPost) {
        return res.status(404).json({ error: 'Post not found' });
      }


      if (existingPost.authorId !== user.id && user.role !== Role.ADMIN) {
        return res.status(403).json({ error: 'Not authorized to delete this post' });
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