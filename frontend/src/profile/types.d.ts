import type { User } from '../auth/types';

export interface ProfileState {
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export interface UpdateProfileData {
  id: number;
  name: string;
  first_name: string;
  birth_date: string;
  address: string;
  phone: string;
  max_annual_revenue: number;
  expense_rate: number;
  email: string;
  password?: string;
  confirmPassword?: string;
}
