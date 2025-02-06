import React from 'react'

interface SocialCardProps { 
    creatorEmail: string; 
    title: string; 
    createdTime: string; 
    content: String;
}


const SocialCard: React.FC<SocialCardProps> = ({
    creatorEmail,
    title,
    createdTime,
    content 
}) => { 
    return ( 
        <div className="border border-gray-300 rounded-lg p-6 shadow-md max-w-md mx-auto my-4">
      {/* Header Section */}
      <div className="mb-3">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">{creatorEmail}</p>
      </div>

      {/* Metadata Section */}
      <div className="mb-4">
        <p className="text-xs text-gray-400">Posted on: {createdTime}</p>
      </div>

      {/* Content Section */}
      <div>
        <p className="text-base text-gray-700">{content}</p>
      </div>
    </div>
  );
};
export default SocialCard;