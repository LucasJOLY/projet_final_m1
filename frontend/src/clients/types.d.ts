export interface Client {
  id: number;
  account_id: number;
  is_company: boolean;
  name: string;
  contact_name: string;
  contact_first_name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface ClientFormData {
  is_company: boolean;
  name?: string | null;
  contact_name: string;
  contact_first_name?: string | null;
  address: string;
  city: string;
  phone: string;
  email: string;
}

export interface ClientSearchParams {
  search?: string;
  name?: string;
  contact_name?: string;
  contact_first_name?: string;
  city?: string;
  email?: string;
  phone?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ClientResponse extends ApiResponse<Client> {}

export interface ClientsResponse
  extends ApiResponse<{
    data: Client[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }> {}
