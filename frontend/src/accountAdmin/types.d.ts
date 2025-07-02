export interface AccountSearchParams {
  search?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  name?: string;
  first_name?: string;
  birth_date?: string;
  address?: string;
  email?: string;
  phone?: string;
  max_annual_revenue?: number;
  expense_rate?: number;
  is_admin?: boolean;
  created_at?: string;
  updated_at?: string;
  name_min?: string;
  name_max?: string;
  first_name_min?: string;
  first_name_max?: string;
  birth_date_min?: string;
  birth_date_max?: string;
  address_min?: string;
  address_max?: string;
  email_min?: string;
  email_max?: string;
  phone_min?: string;
  phone_max?: string;
  max_annual_revenue_min?: number;
  max_annual_revenue_max?: number;
  expense_rate_min?: number;
  expense_rate_max?: number;
}

export interface PaginationInfo {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}

export interface AccountCreateData {
  name: string;
  first_name: string;
  birth_date: string;
  address: string;
  email: string;
  phone: string;
  max_annual_revenue: number;
  expense_rate: number;
  password: string;
  is_admin?: boolean;
}

export interface AccountUpdateData {
  name?: string;
  first_name?: string;
  birth_date?: string;
  address?: string;
  email?: string;
  phone?: string;
  max_annual_revenue?: number;
  expense_rate?: number;
  password?: string;
  is_admin?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AccountsResponse
  extends ApiResponse<{
    data: User[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }> {}
