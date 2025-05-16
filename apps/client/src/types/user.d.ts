export interface User {
  id: number;
  email: string;
  name: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  name: string;
  roleId?: number;  
}

export interface UpdateUserData {
  email?: string;
  name?: string;
  roleId?: number;
}

export interface GetUserData {
  id: number; 
  email: string;
  name: string;
  role: {
    id: number;
    name: string;
    description?: string;
  };
  posts?: { 
    id: number;
    title: string;
    content: string;
    thumbnail?: string;
    createdAt: Date;
    updatedAt: Date;
    published: boolean;
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