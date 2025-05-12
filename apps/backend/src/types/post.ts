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
