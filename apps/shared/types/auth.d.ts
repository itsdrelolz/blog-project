export interface UserData {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export interface TokenPayload {
  id: number;
  email: string;
}