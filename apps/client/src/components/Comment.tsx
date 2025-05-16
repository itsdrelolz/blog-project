import type { Comment } from "@blog-project/shared-types/types/comment";

const Comment: React.FC<Comment> = ({ id, content, authorId, postId, createdAt, author }) => { 
    return (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {author?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900">
                        {author?.name || 'Anonymous'}
                    </h3>
                    <span className="text-sm text-gray-500">
                        {new Date(createdAt).toLocaleDateString()}
                    </span>
                </div>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap">
                {content}
            </div>
        </div>
    )
}

export default Comment;
