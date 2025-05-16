import { useState, useEffect } from "react";
import { fetchPost } from "./postsApi";
import { Post } from "@blog-project/shared-types/types/post";
import { Comment } from "@blog-project/shared-types/types/comment";

export const usePost = (id: string) => {
  const [post, setPost] = useState<(Post & { comments: Comment[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getPost = async (id: number) => {
      try {
        const data = await fetchPost(id);
        setPost(data.post as Post & { comments: Comment[] });
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      setError(new Error("Invalid post ID"));
      setLoading(false);
      return;
    }

    getPost(numericId);
  }, [id]);

  return { post, loading, error };
};

export default usePost;