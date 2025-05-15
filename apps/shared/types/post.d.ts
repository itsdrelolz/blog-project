import { GetUserData } from "./user";

export interface Author {
  id: number;
  email: string;
  name: string;
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  postId: number;
}
export interface Post {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  author: Author;
  comments: any;
  thumbnail: string | null;
}

export interface PostsResponse {
  posts: Post[];
}

export interface PostResponse {
  post: Post;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  posts: Post[];
}



export interface AuthContextType {
  isLoggedIn: boolean;
  user: GetUserData | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export interface CreatePostData {
  title: string;
  content: string;
  thumbnail?: string;
  published?: boolean;
  
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  thumbnail?: string;
  published?: boolean;
}