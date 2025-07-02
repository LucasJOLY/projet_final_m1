import { configAPI } from '../../config/apiConfig';
import type {
  Client,
  ClientFormData,
  ClientSearchParams,
  ClientsResponse,
  ClientResponse,
  ApiResponse,
} from '../types';

const BASE_URL = '/clients';

export const clientAPI = {
  // Récupérer la liste des clients avec pagination et recherche
  getClients: async (params: ClientSearchParams = {}): Promise<ClientsResponse> => {
    const searchParams = new URLSearchParams();

    // Ajouter les paramètres de recherche
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await configAPI.get(`${BASE_URL}?${searchParams.toString()}`);
    return response.data;
  },

  // Récupérer un client par ID
  getClient: async (id: number): Promise<ClientResponse> => {
    const response = await configAPI.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Créer un nouveau client
  createClient: async (clientData: ClientFormData, accountId: number): Promise<ClientResponse> => {
    const response = await configAPI.post(BASE_URL, { ...clientData, account_id: accountId });
    return response.data;
  },

  // Mettre à jour un client
  updateClient: async (
    id: number,
    clientData: ClientFormData,
    accountId: number
  ): Promise<ClientResponse> => {
    const response = await configAPI.put(`${BASE_URL}/${id}`, {
      ...clientData,
      account_id: accountId,
    });
    return response.data;
  },

  // Supprimer un client
  deleteClient: async (id: number): Promise<ApiResponse<null>> => {
    const response = await configAPI.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
