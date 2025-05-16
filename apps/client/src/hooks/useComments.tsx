import { useState, useEffect } from "react";
import { Comment } from '@blog-project/shared-types';
import useAuth from './useAuth';


export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { token } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(import.meta.env.VITE_API_URL + `/public/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data.comments.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt),
        updatedAt: new Date(comment.updatedAt)
      })));
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string): Promise<void> => {
    try {
      if (!token) {
        throw new Error('Authentication required to add comments');
      }
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(import.meta.env.VITE_API_URL + `/public/posts/${postId}/comments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      const formattedComment: Comment = {
        ...newComment,
        createdAt: new Date(newComment.createdAt),
        updatedAt: new Date(newComment.updatedAt)
      };
      
      setComments(prev => [...prev, formattedComment]);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteComment = async (commentId: number) => {
    if (!token) {
      throw new Error('Authentication required to delete comments');
    }

    try {
      const response = await fetch(import.meta.env.VITE_API_URL + `/public/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  }

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments,
    addComment,
    deleteComment
  };
};

export default useComments;