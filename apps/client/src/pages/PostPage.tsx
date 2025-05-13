import { usePost } from "../hooks/usePost";


const PostPage = ({ id }: { id: string }) => {
    const { post, loading, error } = usePost(id);
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!post) return <div>No post found</div>;

    return (
      <div>
        <img src={post.thumbnail} alt={post.title} />
        
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </div>
    )
}

export default PostPage;