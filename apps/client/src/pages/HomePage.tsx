import { usePosts } from "../hooks/usePosts";
import Post from "../components/Post";

const HomePage = () => {
  const { posts, loading, error } = usePosts();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!posts.length) return <div>No posts available.</div>;

  return (
    <div className="grid grid-cols-1 gap-4 p-8">
      <div className="flex flex-col items-center justify-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Blog</h1>
        <p className="text-lg mb-8">Explore our latest posts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <Post key={post.id} {...post} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
