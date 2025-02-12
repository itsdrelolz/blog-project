import { User } from '@prisma/client';

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface TokenPayload {
  id: number;
  email: string;
}
