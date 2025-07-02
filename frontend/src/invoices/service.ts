import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { getIntl } from '../language/config/translation';
import { invoiceAPI } from './api/invoiceAPI';
import type { Invoice, InvoiceFormData, InvoiceFilters } from './types';
import { getErrorValidationMessage } from '../utils/utils';

const locale = localStorage.getItem('language') || 'fr';

export const getInvoices = async (
  filters: InvoiceFilters = {}
): Promise<{
  data: Invoice[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> => {
  try {
    const response = await invoiceAPI.getInvoices(filters);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.invoices.loadError' })
      );
    }
    throw error;
  }
};

export const getInvoice = async (id: number): Promise<Invoice> => {
  try {
    const response = await invoiceAPI.getInvoice(id);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.invoice.loadError' })
      );
    }
    throw error;
  }
};

export const createInvoice = async (invoiceData: InvoiceFormData): Promise<Invoice> => {
  try {
    const response = await invoiceAPI.createInvoice(invoiceData);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.invoice.created' }));
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.invoice.createError' });
    }
    throw error;
  }
};

export const updateInvoice = async (id: number, invoiceData: InvoiceFormData): Promise<Invoice> => {
  try {
    const response = await invoiceAPI.updateInvoice(id, invoiceData);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.invoice.updated' }));
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.invoice.updateError' });
    }
    throw error;
  }
};

export const deleteInvoice = async (id: number): Promise<void> => {
  try {
    await invoiceAPI.deleteInvoice(id);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.invoice.deleted' }));
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.invoice.deleteError' })
      );
    }
    throw error;
  }
};

export const getProjectInvoices = async (
  projectId: number,
  filters: InvoiceFilters = {}
): Promise<{
  data: Invoice[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> => {
  try {
    const response = await invoiceAPI.getInvoices({ ...filters, project_id: projectId });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.invoices.loadError' })
      );
    }
    throw error;
  }
};

export const getClientInvoices = async (
  clientId: number,
  filters: InvoiceFilters = {}
): Promise<{
  data: Invoice[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> => {
  try {
    const response = await invoiceAPI.getInvoices({ ...filters, client_id: clientId });
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.invoices.loadError' })
      );
    }
    throw error;
  }
};

export const getNextInvoiceNumber = async (): Promise<string> => {
  try {
    const nextNumber = await invoiceAPI.getNextInvoiceNumber();
    return nextNumber;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.invoice.nextNumberError' })
      );
    }
    throw error;
  }
};
