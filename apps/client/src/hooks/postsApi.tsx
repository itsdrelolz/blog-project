import { PostResponse } from "../types/post";

<<<<<<< HEAD
export const fetchPosts = async (): Promise<(Post[])> => { 
    const response = await fetch('http://localhost:3000/public/home');
    if (!response.ok) { 
        throw new Error('Failed to fetch posts')
    }
    return response.json();
}
=======
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
>>>>>>> 8c04f6828e838fd7659cb7e66264a914d59e8d4e
