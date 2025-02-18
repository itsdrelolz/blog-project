import { useState, useEffect } from "react";
import { fetchPosts } from "./api";
import { Post as PostInterface, PostResponse } from "../types/post";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data: PostResponse = await fetchPosts();
        console.log("API Response:", data);

        setPosts(data.posts);
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
