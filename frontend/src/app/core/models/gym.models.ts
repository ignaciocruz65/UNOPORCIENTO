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
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  birthDate: string;
  phone?: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';
export type PaymentStatus = 'paid' | 'pending';

export interface Payment {
  id: string;
  amount: number;
  method: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface Subscription {
  id: string;
  plan: Plan;
  startDate: string;
  dueDate: string;
  status: SubscriptionStatus;
  payments: Payment[];
}

export interface InstagramPost {
  id: string;
  caption?: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  permalink: string;
  timestamp: string;
}
