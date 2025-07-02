import { configAPI } from '../../config/apiConfig';
import type { Quote, QuoteFormData, QuoteFilters } from '../types';

export const quotesApi = {
  // Récupérer les devis avec filtres
  getQuotes: async (filters: QuoteFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.project_id) params.append('project_id', filters.project_id.toString());
    if (filters.client_id) {
      // Pour filtrer par client, on doit passer par les projets du client
      const clientProjects = await configAPI.get(`/projects?client_id=${filters.client_id}`);
      const projectIds = clientProjects.data.data.map((p: any) => p.id);
      if (projectIds.length > 0) {
        params.append('project_ids', projectIds.join(','));
      }
    }
    if (filters.status !== undefined) params.append('status', filters.status.toString());
    if (filters.search_term) params.append('search_term', filters.search_term);

    // Tri par quote_number décroissant par défaut
    params.append('sort_by', 'quote_number');
    params.append('sort_order', 'desc');

    const response = await configAPI.get(`/quotes?${params.toString()}`);
    return response.data;
  },

  // Récupérer un devis par ID
  getQuote: async (id: number) => {
    const response = await configAPI.get(`/quotes/${id}`);
    return response.data.data;
  },

  // Créer un nouveau devis
  createQuote: async (quoteData: QuoteFormData) => {
    const response = await configAPI.post('/quotes', quoteData);
    return response.data.data;
  },

  // Mettre à jour un devis
  updateQuote: async (id: number, quoteData: Partial<QuoteFormData>) => {
    const response = await configAPI.put(`/quotes/${id}`, quoteData);
    return response.data.data;
  },

  // Supprimer un devis
  deleteQuote: async (id: number) => {
    const response = await configAPI.delete(`/quotes/${id}`);
    return response.data;
  },

  // Récupérer le prochain numéro de devis
  getNextQuoteNumber: async () => {
    const response = await configAPI.get('/quotes-next-number');
    return response.data.data.next_number;
  },

  // Récupérer les devis d'un projet
  getProjectQuotes: async (filters: QuoteFilters = {}) => {
    const params = new URLSearchParams();
    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status) => params.append('status[]', status.toString()));
    }
    if (filters.project_id) {
      params.append('project_id', filters.project_id.toString());
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
    const url = queryString ? `/quotes?${queryString}` : '/quotes';

    const response = await configAPI.get(url);
    return response.data;
  },

  // Récupérer les devis d'un client (via ses projets)
  getClientQuotes: async (filters: QuoteFilters = {}) => {
    const params = new URLSearchParams();

    if (filters.status && filters.status.length > 0) {
      filters.status.forEach((status) => params.append('status[]', status.toString()));
    }
    if (filters.client_id) {
      params.append('client_id', filters.client_id.toString());
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
    const url = queryString ? `/quotes?${queryString}` : '/quotes';

    const response = await configAPI.get(url);
    return response.data;
  },
};
