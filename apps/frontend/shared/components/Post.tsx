import React from 'react';
import { useState } from 'react';


const Post = ({name, title, content, createdAt}) => {
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
          
          <p dangerouslySetInnerHTML={{ __html: content }} /> {/* Use with caution! */}
        </div>
      </div>
    );
  }

export default Post;