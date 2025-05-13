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