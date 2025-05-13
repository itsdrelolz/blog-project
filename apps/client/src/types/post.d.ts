interface Author {
  id: number;
  email: string;
  name: string;
}

interface Comment {
  id: number;
  content: string;
  authorId: number;
  postId: number;
}
interface Post {
  id: number;
  createdAt: string;
  updatedAt: string?;
  title: string;
  content: string;
  authorId: number;
  published: boolean;
  author: Author;
  comments: any?;
  thumbnail: string?;
}

interface PostsResponse {
  posts: Post[];
}

interface PostResponse {
  post: Post;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: any; 
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

export { Post, PostResponse, PostsResponse, AuthContextType };
