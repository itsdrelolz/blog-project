import { Post } from "@blog-project/shared-types/types/post";


export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch("http://localhost:3000/public/posts");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data.posts;
};

