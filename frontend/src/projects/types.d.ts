import type { Client } from '../clients';

export interface Project {
  id: number;
  client_id: number;
  name: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  client?: Client;
}

export type ProjectStatus = 0 | 1 | 2 | 3 | 4 | 5;

export interface ProjectFormData {
  client_id: number;
  name: string;
  status: ProjectStatus;
}

export interface ProjectSearchParams {
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  status?: ProjectStatus[];
  client_id?: number;
}

export interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  loading: boolean;
  pagination: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  } | null;
}

export interface ProjectStatusOption {
  value: ProjectStatus;
  label: string;
  color: string;
  backgroundColor: string;
}

// Types de réponse API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProjectResponse extends ApiResponse<Project> {}

export interface ProjectsResponse
  extends ApiResponse<{
    data: Project[];
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  }> {}
