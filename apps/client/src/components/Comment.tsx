import { Comment as CommentType } from '../types';


interface CommentProps extends Omit<CommentType, 'authorId' | 'postId' | 'updatedAt'> {
    currentUserId: number | null;
    postAuthorId: number;
    onDelete: (commentId: number) => Promise<void>;
}

const Comment: React.FC<CommentProps> = ({
    id,
    content,
    author,
    createdAt,
    currentUserId,
    postAuthorId,
    onDelete,
}) => {
    const formattedDate = new Date(createdAt).toLocaleDateString();
    return (
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm hover:bg-gray-50 transition-colors">
            <div className="flex items-center mb-3">
                <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {author?.name?.[0]?.toUpperCase() || 'A'}
                </div>
                <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-900">
                        {author.name} 
                    </h3>
                    <span className="text-sm text-gray-500">
                        <time dateTime={createdAt.toISOString()}>{formattedDate}</time>
                    </span>
                </div>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap">
                {content}
            </div>
            {(currentUserId !== null && (currentUserId === author.id || currentUserId === postAuthorId)) && (
                <button
                    onClick={() => onDelete(id)}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm self-end"
                >
                    Delete
                </button>
            )}
        </div>
    )
}

export default Comment;
