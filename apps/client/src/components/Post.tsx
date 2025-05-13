import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Post } from "@blog-project/shared-types";

const Post: React.FC<Post> = ({ id, title, content, author, createdAt, thumbnail }) => {
  const navigate = useNavigate();
  const formattedDate = new Date(createdAt).toLocaleDateString();
  const [imageError, setImageError] = useState(false);

  const handlePostClick = () => {
    navigate(`/post/${id}`);
  };

  const getImageUrl = (url: string | null): string | undefined => {
    if (!url) return undefined;
    
    // Decode HTML entities in the URL
    const decodedUrl = url.replace(/&#x2F;/g, '/').replace(/&amp;/g, '&');
    return `${decodedUrl}?t=${Date.now()}`;
  };

  const handleImageError = () => {
    console.error('Image failed to load:', thumbnail);
    setImageError(true);
  };

  const renderContent = (htmlContent: string) => {
    return { __html: htmlContent };
  };

  return (
    <article 
      onClick={handlePostClick}
      className="flex flex-col bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden cursor-pointer"
    >
      {thumbnail && !imageError && (
        <div className="relative w-full h-48">
          <img 
            src={getImageUrl(thumbnail)} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={handleImageError}
            crossOrigin="anonymous"
          />
        </div>
      )}
      <div className="flex flex-col flex-grow p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h2>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">{author?.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={createdAt instanceof Date ? createdAt.toISOString() : String(createdAt)}>{formattedDate}</time>
          </div>
        </div>
        <div 
          className="prose prose-sm max-w-none line-clamp-3 text-gray-600"
          dangerouslySetInnerHTML={renderContent(content)} 
        />
      </div>
    </article>
  );
};

export default Post;
