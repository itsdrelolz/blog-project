export interface User {
  id: number;
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
    description?: string;
  };
  posts?: Post[];
  comments?: Comment[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  published: boolean;
  author?: User;
  comments?: Comment[];
}

export interface Comment {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  postId: number;
  author?: User;
}

export interface AuthResponse {
  user: User;
  token: string;
} 