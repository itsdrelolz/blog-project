import React from 'react';
import type { Post } from '../types/post'; 




const Post: React.FC<Post> = ({name, title, content, createdAt})  => {
    const formattedDate = new Date(createdAt).toLocaleDateString();
    return ( 
        <div className="post">
        <div className="post-header">
          <h2 className="post-title">{title}</h2>
          <div className="post-meta">
            <span className="post-author">By {name}</span>
            <span className="post-date"> - {formattedDate}</span>
          </div>
        </div>
        <div className="post-content">
          
            <p>{content}</p>
        </div>
      </div>
    );
  }

export default Post;