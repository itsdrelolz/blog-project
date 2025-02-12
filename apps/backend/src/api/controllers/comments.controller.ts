import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { CommentService } from '../../services/comment.services';
import { TokenPayload } from '../../types'; // Make sure this import is correct

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

  public async updateComment(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId!);
      const { content } = req.body;

      if (!content || isNaN(postId) || isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid request data' });
      }

      const comment = await this.commentService.updateComment(
        commentId,
        postId,
        content,
        user.id,
      ); // No need to pass user.role

      return res.json({ comment });
    } catch (error) {
      console.error('Error updating comment:', error);
      if (error instanceof Error) {
        switch (
          error.message // Use a switch for cleaner error handling
        ) {
          case 'Comment not found':
          case 'Post not found':
            return res.status(404).json({ error: error.message });
          case 'Not authorized to update this comment':
            return res.status(403).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Failed to update comment' }); // Consistent message
    }
  }

  public async deleteComment(req: Request, res: Response): Promise<Response> {
    try {
      const user = req.user as TokenPayload;
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId!);

      if (isNaN(postId) || isNaN(commentId)) {
        return res.status(400).json({ error: 'Invalid ID provided' });
      }

      await this.commentService.deleteComment(commentId, postId, user.id);

      return res.status(204).send();
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error instanceof Error) {
        switch (
          error.message // Use a switch for cleaner error handling
        ) {
          case 'Comment not found':
          case 'Post not found':
            return res.status(404).json({ error: error.message });
          case 'Not authorized to delete this comment':
            return res.status(403).json({ error: error.message });
        }
      }
      return res.status(500).json({ error: 'Failed to delete comment' }); // Consistent message
    }
  }
}

export default CommentController;
