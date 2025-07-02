import type { User } from '../../auth/types';
import { configAPI } from '../../config/apiConfig';
import type {
  AccountSearchParams,
  AccountsResponse,
  AccountUpdateData,
  ApiResponse,
} from '../types';

const BASE_URL = '/accounts';

export const accountAdminAPI = {
  // Récupérer la liste des comptes avec filtres et pagination
  getAccounts: async (params: AccountSearchParams = {}): Promise<AccountsResponse> => {
    const searchParams = new URLSearchParams();

    // Ajouter les paramètres de recherche
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });

    const response = await configAPI.get(`${BASE_URL}?${searchParams.toString()}`);
    console.log(response.data);
    return response.data;
  },

  // Récupérer un compte par ID
  getAccount: async (id: number): Promise<{ data: User }> => {
    const response = await configAPI.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Mettre à jour un compte (notamment pour passer en admin)
  updateAccount: async (id: number, data: AccountUpdateData): Promise<{ data: User }> => {
    const response = await configAPI.put(`${BASE_URL}/${id}`, data);
    return response.data;
  },

  // Supprimer un compte
  deleteAccount: async (id: number): Promise<ApiResponse<null>> => {
    const response = await configAPI.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Passer un compte en admin
  makeAdmin: async (id: number): Promise<{ data: User }> => {
    const response = await configAPI.put(`${BASE_URL}/${id}`, { is_admin: true });
    return response.data;
  },
};
