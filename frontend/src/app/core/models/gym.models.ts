export interface Plan {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationDays: number;
  active: boolean;
}

export type UserRole = 'member' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}
