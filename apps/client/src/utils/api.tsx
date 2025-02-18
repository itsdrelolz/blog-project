import { PostResponse } from "../types/post";
import { PostData } from "../types/post"
const API_BASE_URL = "http://localhost:3000"

export const getPublicPosts = async (): Promise<PostResponse> => {
  const response = await fetch(`${API_BASE_URL}/public/posts`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `API error ${response.status}: ${errorData.message || response.statusText}`,
    );
  }

  return response.json();
};




export const getPublicPost = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/public/posts/${id}`)

  if (!response.ok) { 
    const errorData = await response.json();
    throw new Error( 
      `API Error ${response.status}: ${errorData.message|| response.statusText}`, 
    )
  }
  return response.json()
  }



  export const createPost = async (postData: PostData) => {
    const token = localStorage.getItem("token");
  
    try {
      const response = await fetch(`${API_BASE_URL}/creator/posts`, {
        method: "POST", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData), 
      });
  
      if (!response.ok) { 
        const errorData = await response.json();
        throw new Error(
          `API error ${response.status}: ${errorData.message || response.statusText}`,
        );
      }
  
      return response.json(); 
    } catch (error) {
      console.error("Error creating post:", error);
      throw error; 
    }
  };

  export const updatePost = async(id: string, postData: PostData) => { 
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_BASE_URL}/creator/posts`, {
        method: "PUT", 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData), 
      });
        if (!response.ok) { 
          const errorData = await response.json();
          throw new Error(
            `API error ${response.status}: ${errorData.message || response.statusText}`,
          );
        }
    
        return response.json(); 
      } catch (error) {
        console.error("Error creating post:", error);
        throw error; 
      }
    };