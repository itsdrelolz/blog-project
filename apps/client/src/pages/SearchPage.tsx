import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Post from '../components/Post';
import { Post as PostType } from '@blog-project/shared-types/types/post';
import LoadingSpinner from '../components/LoadingSpinner';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/public/posts/search?q=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while searching');
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchPosts();
    } else {
      setPosts([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="large" text="Searching posts..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">
        {query ? `Search results for "${query}"` : 'Search Results'}
      </h1>
      
      {posts.length === 0 ? (
        <div className="text-center text-gray-600 mt-8">
          {query ? 'No posts found matching your search.' : 'Enter a search term to find posts.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchPage; 