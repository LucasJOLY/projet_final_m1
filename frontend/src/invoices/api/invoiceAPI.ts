import { configAPI } from '../../config/apiConfig';
import type { Invoice, InvoiceFormData } from '../types';

export interface InvoiceFilters {
  status?: number[];
  client_id?: number;
  project_id?: number;
  overdue_only?: boolean;
  search_term?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  per_page?: number;
  page?: number;
}

export interface PaginatedInvoicesResponse {
  data: Invoice[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

class InvoiceAPI {
  private basePath = '/invoices';

  // Récupérer toutes les factures avec filtres
  async getInvoices(filters: InvoiceFilters = {}): Promise<PaginatedInvoicesResponse> {
    const params = new URLSearchParams();

    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status) => params.append('status[]', status.toString()));
    }
    if (filters.client_id) {
      params.append('client_id', filters.client_id.toString());
    }
    if (filters.project_id) {
      params.append('project_id', filters.project_id.toString());
    }
    if (filters.overdue_only) {
      params.append('overdue_only', 'true');
    }
    if (filters.search_term) {
      params.append('search_term', filters.search_term);
    }
    if (filters.sort_by) {
      params.append('sort_by', filters.sort_by);
    }
    if (filters.sort_order) {
      params.append('sort_order', filters.sort_order);
    }
    if (filters.per_page) {
      params.append('per_page', filters.per_page.toString());
    }
    if (filters.page) {
      params.append('page', filters.page.toString());
    }

    const queryString = params.toString();
    const url = queryString ? `${this.basePath}?${queryString}` : this.basePath;

    const response = await configAPI.get(url);
    return response.data.data;
  }

  // Récupérer les factures d'un projet
  async getProjectInvoices(projectId: number): Promise<PaginatedInvoicesResponse> {
    const response = await this.getInvoices({ project_id: projectId });
    return response;
  }

  // Récupérer les factures d'un client
  async getClientInvoices(clientId: number): Promise<PaginatedInvoicesResponse> {
    const response = await this.getInvoices({ client_id: clientId });
    return response;
  }

  // Récupérer une facture par ID
  async getInvoice(id: number): Promise<Invoice> {
    const response = await configAPI.get(`${this.basePath}/${id}`);
    return response.data.data;
  }

  // Créer une nouvelle facture
  async createInvoice(invoiceData: InvoiceFormData): Promise<Invoice> {
    const response = await configAPI.post(this.basePath, invoiceData);
    return response.data.data;
  }

  // Mettre à jour une facture
  async updateInvoice(id: number, invoiceData: InvoiceFormData): Promise<Invoice> {
    const response = await configAPI.put(`${this.basePath}/${id}`, invoiceData);
    return response.data.data;
  }

  // Supprimer une facture
  async deleteInvoice(id: number): Promise<void> {
    await configAPI.delete(`${this.basePath}/${id}`);
  }

  // Récupérer le prochain numéro de facture
  async getNextInvoiceNumber(): Promise<string> {
    const response = await configAPI.get(`${this.basePath}-next-number`);
    return response.data.data.next_number;
  }
}

export const invoiceAPI = new InvoiceAPI();
