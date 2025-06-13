import { Follow } from '../profil/type';

interface User {
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
  accessToken: string;
}

interface AuthState {
  token: string | null;
  authUser: User | null;
  resetTokenValid: boolean | null;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export type { User, AuthState, PasswordStrength };
