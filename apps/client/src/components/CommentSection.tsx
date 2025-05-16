import { useState } from 'react';
import type { Comment as CommentType } from "@blog-project/shared-types/types/comment";
import Comment from './Comment';
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

interface CommentSectionProps {
  comments: CommentType[];
  onAddComment: (content: string) => Promise<void>;
  currentUserId: number | null;
  postAuthorId: number;
  onDeleteComment: (commentId: number) => Promise<void>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ comments, onAddComment, currentUserId, postAuthorId, onDeleteComment }) => {
  const [newComment, setNewComment] = useState('');
  const { isLoggedIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    await onAddComment(newComment);
    setNewComment('');
  };

  if (!isLoggedIn) {
    return (
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          <div className="space-y-4 mb-6">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="font-medium text-gray-900">{comment.author.name}</p>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-6">No comments yet.</p>
        )}
        <div className="bg-white p-4 rounded-lg shadow-sm text-center">
          <p className="text-gray-600 mb-4">Please log in to join the discussion</p>
          <Link
            to="/auth/login"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Log In to Comment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Comments</h2>
      {comments.length > 0 ? (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <p className="font-medium text-gray-900">{comment.author.name}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                  {(currentUserId === comment.authorId || currentUserId === postAuthorId) && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Delete comment"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 text-gray-700">{comment.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 mb-6">Be the first to comment!</p>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="comment" className="sr-only">
            Add a comment
          </label>
          <textarea
            id="comment"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Post Comment
        </button>
      </form>
    </div>
  );
};

export default CommentSection;