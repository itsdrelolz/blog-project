import { PostResponse } from "../types/post";

export const fetchPosts = async (): Promise<PostResponse> => {
  const response = await fetch("http://localhost:3000/public/home");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
};
