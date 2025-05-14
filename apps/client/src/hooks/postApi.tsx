import { Post } from "@blog-project/shared-types/types/post";

export const fetchPost = async (id: number): Promise<{ post: Post }> => {
  const response = await fetch(`http://localhost:3000/public/posts/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
};
