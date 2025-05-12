export interface CreateUserData {
  email: string;
  password: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}


export interface GetUserData {
  id: number; 
  email: string;
  name: string;
  posts?: { 
      id: number;
      title: string;
      content: string;
      createdAt: Date;
      updatedAt: Date;
  }[]; 
  comments?: { 
      id: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
  }[]; 
  createdAt?: Date; 
  updatedAt?: Date;
}