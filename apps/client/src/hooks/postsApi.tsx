import { Post } from "@blog-project/shared-types/types/post";
import { UpdatePostData } from "@blog-project/shared-types/types/post";


export const fetchPosts = async (page: number = 1, limit: number = 9): Promise<{ posts: Post[], total: number }> => {
  const response = await fetch(`http://localhost:3000/public/posts?page=${page}&limit=${limit}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  const data = await response.json();
  return data;
};

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


export const updatePost = async (id: number, post: UpdatePostData) => {
  const response = await fetch(`http://localhost:3000/creator/posts/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(post)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update post');
  }
};

export const deletePost = async (id: number) => {
  const response = await fetch(`http://localhost:3000/creator/posts/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete post');
  }
};


