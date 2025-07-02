import type { Project } from '../projects';

export type InvoiceStatus = 0 | 1 | 2 | 3 | 4; // 0=brouillon, 1=éditée, 2=envoyée, 3=payée, 4=en retard

export interface InvoiceLine {
  id?: number;
  invoice_id?: number;
  description: string;
  unit_price: number;
  quantity: number;
  total?: number;
}

export interface Invoice {
  id: number;
  project_id: number;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  payment_due_date: string;
  payment_type: 'bank_transfer' | 'check' | 'cash' | 'credit_card';
  actual_payment_date?: string;
  footer_note?: string;
  created_at: string;
  updated_at: string;
  total?: number;
  project?: Project;
  invoice_lines?: InvoiceLine[];
}

export interface InvoiceFormData {
  project_id: number;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  payment_due_date: string;
  payment_type: 'bank_transfer' | 'check' | 'cash' | 'credit_card';
  actual_payment_date?: string;
  footer_note?: string;
  invoice_lines: InvoiceLine[];
}

export interface InvoiceFilters {
  status?: InvoiceStatus[];
  client_id?: number;
  project_id?: number;
  overdue_only?: boolean;
  search_term?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface InvoicesState {
  invoices: Invoice[];
  currentInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}
