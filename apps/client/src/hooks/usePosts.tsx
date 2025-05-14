import { useState, useEffect } from "react";
import { fetchPosts } from "./postsApi";
import { Post } from "@blog-project/shared-types/types/post";


export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data: Post[] = await fetchPosts();
        console.log('Fetched posts:', data);
        setPosts(data);
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, []);

  return { posts, loading, error };
};

export default usePosts;
