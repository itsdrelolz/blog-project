import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CommentService } from '../../services/comment.services';
import { TokenPayload } from '@blog-project/shared-types/types/auth'; 

class CommentController {
  private commentService: CommentService;

  constructor(prisma: PrismaClient) {
    this.commentService = new CommentService(prisma);
  }

  public async addComment(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const { content } = req.body;
      const postId = parseInt(req.params.postId);

      if (!content) {
        return res.status(400).json({ error: 'Comment content is required' });
      }

      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      const comment = await this.commentService.createComment(user.id, {
        content,
        postId,
      });

      return res.status(201).json({ comment });
    } catch (error) {
      console.error('Error creating comment:', error);
      if (error instanceof Error && error.message === 'Post not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to create comment' }); // Consistent message
    }
  }

  public async getPostComment(req: Request, res: Response): Promise<Response> {
    try {
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId!);

      if (isNaN(postId) || isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid ID provided' });
      }

      const comment = await this.commentService.getCommentById(
        commentId,
        postId,
      );

      if (!comment) {
        return res.status(404).json({ error: 'Comment not found' });
      }

      return res.json({ comment });
    } catch (error) {
      console.error('Error fetching comment:', error);
      if (error instanceof Error && error.message === 'Post not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error fetching comment' }); // Consistent message
    }
  }

  public async getPostComments(req: Request, res: Response): Promise<Response> {
    try {
      const postId = parseInt(req.params.postId);

      if (isNaN(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
      }

      const comments = await this.commentService.getCommentsByPostId(postId);
      return res.json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (error instanceof Error && error.message === 'Post not found') {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Error fetching comments' }); // Consistent message
    }
  }



  


  // Update so that only the post author can delete comments 

  public async deleteComment(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId);

      if (isNaN(postId) || isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid post or comment ID' });
      }

      const comment = await this.commentService.deleteComment(commentId, postId, user.id);
      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error instanceof Error) {
        if (error.message === 'Comment not found') {
          return res.status(404).json({ error: error.message });
        }
        if (error.message === 'Not authorized to delete this comment') {
          return res.status(403).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Failed to delete comment' });
    }
  }
}

export default CommentController;
