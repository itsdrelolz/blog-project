import { Post } from "@blog-project/shared-types";


export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("http://localhost:3000/public/posts");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
};

