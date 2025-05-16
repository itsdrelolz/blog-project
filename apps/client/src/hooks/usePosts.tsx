import { useState, useEffect } from "react";
import { fetchPosts } from "./postsApi";
import { Post } from "@blog-project/shared-types";

export const usePosts = (initialPage: number = 1, postsPerPage: number = 9) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getPosts = async () => {
      try {
        setLoading(true);
        const data = await fetchPosts(currentPage, postsPerPage);
        setPosts(data.posts);
        setTotalPosts(data.total);
        setTotalPages(Math.ceil(data.total / postsPerPage));
      } catch (error) {
        setError(error as Error);
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    getPosts();
  }, [currentPage, postsPerPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return { 
    posts, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    totalPosts,
    goToPage 
  };
};

export default usePosts;
