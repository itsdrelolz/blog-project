import React, { useState } from "react";
import type { Post } from "../types/post";

const Post: React.FC<Post> = ({ title, content, author, createdAt, thumbnail }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const [imageError, setImageError] = useState(false);

  const getImageUrl = (url: string | null): string | undefined => {
    if (!url) return undefined;
    
    // If it's a local upload, prepend the API base URL
    if (url.startsWith('/uploads/')) {
      return `http://localhost:3000${url}`;
    }
    
    // For Supabase URLs, ensure they have the correct format
    if (url.includes('supabase.co')) {
      // Add any necessary query parameters for public access
      return `${url}?t=${Date.now()}`; // Add timestamp to prevent caching issues
    }
    
    return url;
  };

  const handleImageError = () => {
    console.error('Image failed to load:', thumbnail);
    setImageError(true);
  };

  console.log('Post thumbnail:', thumbnail); // Debug log
  return (
    <div className="post border rounded p-4 mb-4 shadow">
      {thumbnail && !imageError && (
        <div className="post-image mb-4">
          <img 
            src={getImageUrl(thumbnail)} 
            alt={title} 
            className="w-full h-48 object-cover rounded"
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        </div>
      )}
      <div className="post-header flex justify-between items-center mb-2">
        <h2 className="post-title text-xl font-bold">{title}</h2>
        <div className="post-meta text-gray-500">
          <span className="post-author mr-2">By {author.name}</span>
          <span className="post-date">- {formattedDate}</span>
        </div>
      </div>
      <div className="post-content">
        <p className="text-gray-700">{content}</p>
      </div>
    </div>
  );
};

export default Post;
