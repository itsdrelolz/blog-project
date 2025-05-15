import { usePost } from "../hooks/usePost";
import DOMPurify from "dompurify";

const PostPage = ({ id }: { id: string }) => {
  const { post, loading, error } = usePost(id);
  if (loading) return <div>Loading...</div>;
  if (error)   return <div>Error: {error.message}</div>;
  if (!post)   return <div>No post found</div>;


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
    </main>
  );
};

export default PostPage;
