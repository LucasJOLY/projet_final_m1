import { configAPI } from '../../config/apiConfig';
import type {
  Project,
  ProjectFormData,
  ProjectSearchParams,
  ProjectsResponse,
  ProjectResponse,
  ApiResponse,
} from '../types';

const BASE_URL = '/projects';

export const projectAPI = {
  // Récupérer la liste des projets avec pagination et recherche
  getProjects: async (params: ProjectSearchParams = {}): Promise<ProjectsResponse> => {
    const searchParams = new URLSearchParams();

    // Ajouter les paramètres de recherche
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (key === 'status' && Array.isArray(value)) {
          // Gérer le tableau de statuts
          value.forEach((status) => {
            searchParams.append('status[]', status);
          });
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });

    const response = await configAPI.get(`${BASE_URL}?${searchParams.toString()}`);
    return response.data;
  },

  // Récupérer un projet par ID
  getProject: async (id: number): Promise<ProjectResponse> => {
    const response = await configAPI.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  // Créer un nouveau projet
  createProject: async (
    projectData: ProjectFormData,
    accountId: number
  ): Promise<ProjectResponse> => {
    const response = await configAPI.post(BASE_URL, { ...projectData, account_id: accountId });
    return response.data;
  },

  // Mettre à jour un projet
  updateProject: async (
    id: number,
    projectData: ProjectFormData,
    accountId: number
  ): Promise<ProjectResponse> => {
    const response = await configAPI.put(`${BASE_URL}/${id}`, {
      ...projectData,
      account_id: accountId,
    });
    return response.data;
  },

  // Supprimer un projet
  deleteProject: async (id: number): Promise<ApiResponse<null>> => {
    const response = await configAPI.delete(`${BASE_URL}/${id}`);
    return response.data;
  },
};
