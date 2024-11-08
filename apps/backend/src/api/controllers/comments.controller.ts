import { RequestHandler } from 'express';
import { PrismaClient } from '@prisma/client';
import { CommentService } from '../../services/comment.services';
import { CreateCommentDto, UpdateCommentDto } from '../../types';
import { ParamsDictionary } from 'express-serve-static-core';
import { TokenPayload } from '../../types';

interface CommentParams extends ParamsDictionary {
  postId: string;
  commentId: string;
}

export class CommentController {
  private commentService: CommentService;

  constructor(prisma: PrismaClient) {
    this.commentService = new CommentService(prisma);
  }

  addComment: RequestHandler<
    CommentParams,
    { comment: any } | { error: string },
    CreateCommentDto
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = req.user as TokenPayload;
      const { content } = req.body;
      const postId = parseInt(req.params.postId);

      if (!content) {
        res.status(400).json({ error: 'Comment content is required' });
        return;
      }

      if (isNaN(postId)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return;
      }

      const comment = await this.commentService.createComment(user.id, {
        content,
        postId,
      });

      res.status(201).json({ comment });
    } catch (error) {
      console.error('Error creating comment:', error);
      if (error instanceof Error && error.message === 'Post not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Failed creating a comment' });
    }
  };

  getPostComment: RequestHandler<
    CommentParams,
    { comment: any } | { error: string }
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId!);

      if (isNaN(postId) || isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid ID provided' });
        return;
      }

      const comment = await this.commentService.getCommentById(commentId, postId);
      
      if (!comment) {
        res.status(404).json({ error: 'Comment not found' });
        return;
      }

      res.json({ comment });
    } catch (error) {
      console.error('Error fetching comment:', error);
      if (error instanceof Error && error.message === 'Post not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error fetching comment' });
    }
  };

  getPostComments: RequestHandler<
    CommentParams,
    { comments: any[] } | { error: string }
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const postId = parseInt(req.params.postId);
      if (isNaN(postId)) {
        res.status(400).json({ error: 'Invalid post ID' });
        return;
      }

      const comments = await this.commentService.getCommentsByPostId(postId);
      res.json({ comments });
    } catch (error) {
      console.error('Error fetching comments:', error);
      if (error instanceof Error && error.message === 'Post not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error fetching comments' });
    }
  };

  updateComment: RequestHandler<
    CommentParams,
    { comment: any } | { error: string },
    UpdateCommentDto
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = req.user as TokenPayload;
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId!);
      const { content } = req.body;

      if (!content || isNaN(postId) || isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid request data' });
        return;
      }

      const comment = await this.commentService.updateComment(
        commentId,
        postId,
        content,
        user.id,
        user.role
      );

      res.json({ comment });
    } catch (error) {
      console.error('Error updating comment:', error);
      if (error instanceof Error) {
        if (error.message === 'Comment not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === 'Not authorized to update this comment') {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      res.status(500).json({ error: 'Failed to update comment' });
    }
  };

  deleteComment: RequestHandler<
    CommentParams,
    { error: string } | {}
  > = async (req, res): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }

      const user = req.user as TokenPayload;
      const postId = parseInt(req.params.postId);
      const commentId = parseInt(req.params.commentId!);

      if (isNaN(postId) || isNaN(commentId)) {
        res.status(400).json({ error: 'Invalid ID provided' });
        return;
      }

      await this.commentService.deleteComment(
        commentId,
        postId,
        user.id,
        user.role
      );

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting comment:', error);
      if (error instanceof Error) {
        if (error.message === 'Comment not found') {
          res.status(404).json({ error: error.message });
          return;
        }
        if (error.message === 'Not authorized to delete this comment') {
          res.status(403).json({ error: error.message });
          return;
        }
      }
      res.status(500).json({ error: 'Failed to delete comment' });
    }
  };
}

export default CommentController;