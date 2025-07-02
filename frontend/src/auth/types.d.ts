import { Follow } from '../profil/type';

export interface User {
  id: number;
  name: string;
  first_name: string;
  birth_date: string;
  address: string;
  city: string;
  phone: string;
  max_annual_revenue: number;
  expense_rate: number;
  email: string;
  password: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };
  account: User;
}

export interface AuthState {
  token: string | null;
  authUser: User | null;
  resetTokenValid: boolean | null;
  loadingSendEmail: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export type { User, AuthState, PasswordStrength };
