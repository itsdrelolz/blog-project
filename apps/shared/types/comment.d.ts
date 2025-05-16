import { User } from "./user";

export interface Comment {
  id: number;
  content: string;
  authorId?: number;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
  author?: User;
}


export interface CreateCommentDto {
    content: string;
  }
  
  export interface UpdateCommentDto {
    content: string;
  }
  
  export interface CreateCommentData {
    content: string;
    postId: number;
  }