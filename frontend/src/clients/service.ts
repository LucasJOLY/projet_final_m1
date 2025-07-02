import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { getIntl } from '../language/config/translation';
import { clientAPI } from './api/clientAPI';
import type {
  Client,
  ClientFormData,
  ClientSearchParams,
  ClientsResponse,
  ClientResponse,
} from './types';
import { getErrorValidationMessage } from '../utils/utils';

const locale = localStorage.getItem('language') || 'fr';

export const getClients = async (params: ClientSearchParams = {}): Promise<ClientsResponse> => {
  try {
    const response = await clientAPI.getClients(params);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.clients.loadError' })
      );
    }
    throw error;
  }
};

export const getClient = async (id: number): Promise<Client> => {
  try {
    const response = await clientAPI.getClient(id);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.client.loadError' })
      );
    }
    throw error;
  }
};

export const createClient = async (
  clientData: ClientFormData,
  accountId: number
): Promise<Client> => {
  try {
    const response = await clientAPI.createClient(clientData, accountId);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.client.created' }));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.client.createError' });
    }
    throw error;
  }
};

export const updateClient = async (
  id: number,
  clientData: ClientFormData,
  accountId: number
): Promise<Client> => {
  try {
    const response = await clientAPI.updateClient(id, clientData, accountId);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.client.updated' }));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.client.updateError' });
    }
    throw error;
  }
};

export const deleteClient = async (id: number): Promise<void> => {
  try {
    await clientAPI.deleteClient(id);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.client.deleted' }));
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.client.deleteError' })
      );
    }
    throw error;
  }
};
