import React from "react";
import type { Post } from "../types/post";

const Post: React.FC<Post> = ({ title, content, author, createdAt }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();
  return (
    <div className="post border rounded p-4 mb-4 shadow">
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
