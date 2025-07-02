import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { getIntl } from '../language/config/translation';
import { projectAPI } from './api/projectAPI';
import type {
  Project,
  ProjectFormData,
  ProjectSearchParams,
  ProjectsResponse,
  ProjectResponse,
} from './types';
import { getErrorValidationMessage } from '../utils/utils';

const locale = localStorage.getItem('language') || 'fr';

export const getProjects = async (params: ProjectSearchParams = {}): Promise<ProjectsResponse> => {
  try {
    const response = await projectAPI.getProjects(params);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.projects.loadError' })
      );
    }
    throw error;
  }
};

export const getProject = async (id: number): Promise<Project> => {
  try {
    const response = await projectAPI.getProject(id);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.project.loadError' })
      );
    }
    throw error;
  }
};

export const createProject = async (
  projectData: ProjectFormData,
  accountId: number
): Promise<Project> => {
  try {
    const response = await projectAPI.createProject(projectData, accountId);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.project.created' }));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.project.createError' });
    }
    throw error;
  }
};

export const updateProject = async (
  id: number,
  projectData: ProjectFormData,
  accountId: number
): Promise<Project> => {
  try {
    const response = await projectAPI.updateProject(id, projectData, accountId);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.project.updated' }));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.project.updateError' });
    }
    throw error;
  }
};

export const deleteProject = async (id: number): Promise<void> => {
  try {
    await projectAPI.deleteProject(id);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.project.deleted' }));
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.project.deleteError' })
      );
    }
    throw error;
  }
};
