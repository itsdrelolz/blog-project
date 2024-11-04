import { User } from '@prisma/client';
import { UserRole } from './user';

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
  role: UserRole;
}
