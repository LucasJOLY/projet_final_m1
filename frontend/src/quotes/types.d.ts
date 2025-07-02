import type { Project } from '../projects';

export interface Quote {
  id: number;
  project_id: number;
  quote_number: string;
  status: QuoteStatus;
  issue_date: string;
  expiry_date: string;
  note?: string;
  created_at: string;
  updated_at: string;
  total?: number;
  project?: Project;
  quote_lines?: QuoteLine[];
}

export interface QuoteLine {
  id: number;
  quote_id: number;
  description: string;
  unit_price: number;
  quantity: number;
  total?: number;
}

export type QuoteStatus = 0 | 1 | 2; // 0 = envoyé, 1 = accepté, 2 = refusé

export interface QuoteFormData {
  project_id: number;
  quote_number: string;
  status: QuoteStatus;
  issue_date: string;
  expiry_date: string;
  note?: string;
  quote_lines: QuoteLineFormData[];
}

export interface QuoteLineFormData {
  id?: number;
  description: string;
  unit_price: number;
  quantity: number;
}

export interface QuotesState {
  quotes: Quote[];
  currentQuote: Quote | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface QuoteFilters {
  project_id?: number;
  client_id?: number;
  status?: number[];
  search_term?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}
