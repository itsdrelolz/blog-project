import CommentSection from "../components/CommentSection";
import { usePost } from "../hooks/usePost";
import { useComments } from "../hooks/useComments";
import DOMPurify from "dompurify";

const PostPage = ({ id }: { id: string }) => {
  const { post, loading: postLoading, error: postError } = usePost(id);
  const numericId = parseInt(id, 10);
  const { comments, loading: commentsLoading, error: commentsError, addComment } = useComments(numericId);

  if (postLoading || commentsLoading) return <div>Loading...</div>;
  if (postError) return <div>Error: {postError.message}</div>;
  if (commentsError) return <div>Error loading comments: {commentsError.message}</div>;
  if (!post) return <div>No post found</div>;

  const cleanHtml = DOMPurify.sanitize(post.content);

  return (
    <main className="w-full max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.thumbnail && (
          <div className="w-full h-96">
            <img
              src={post.thumbnail}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>

          <div className="flex items-center text-gray-500 mb-8">
            <span className="font-medium">Author: {post.author.name}</span>
            <span className="mx-2">•</span>
            <time dateTime={String(post.createdAt)}>{new Date(post.createdAt).toLocaleDateString()}</time>
          </div>

          <div
            className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-700"
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
          />
        </div>
      </article>
      <CommentSection comments={comments} onAddComment={addComment} />
    </main>
  );
};

export default PostPage;