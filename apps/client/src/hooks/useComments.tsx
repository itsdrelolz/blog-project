import { useState, useEffect } from "react";
import { Comment } from "@blog-project/shared-types/types/comment";

export const useComments = (postId: number) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/public/posts/${postId}/comments`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    try {
      const response = await fetch(`http://localhost:3000/public/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const newComment = await response.json();
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  return {
    comments,
    loading,
    error,
    refreshComments: fetchComments,
    addComment
  };
}; 