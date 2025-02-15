interface Author {
  id: number;
  email: string;
  name: string;
}

interface Post {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  author: Author;
  comments: any;
}

interface PostResponse {
  posts: Post[];
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: any; 
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export { Post, PostResponse, AuthContextType };
