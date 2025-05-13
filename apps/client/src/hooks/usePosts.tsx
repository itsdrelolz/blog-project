import { useState, useEffect } from "react";
import { fetchPosts } from "./postsApi";
import { Post as PostInterface, PostsResponse } from "../types/post";

export const usePosts = () => {
  const [posts, setPosts] = useState<PostInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data: PostsResponse = await fetchPosts();
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
