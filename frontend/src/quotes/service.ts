import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { getIntl } from '../language/config/translation';
import { quotesApi } from './api/quoteApi';
import type { Quote, QuoteFormData, QuoteFilters } from './types';
import { getErrorValidationMessage } from '../utils/utils';

const locale = localStorage.getItem('language') || 'fr';

export const getQuotes = async (
  filters: QuoteFilters = {}
): Promise<{
  data: Quote[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> => {
  try {
    const response = await quotesApi.getQuotes(filters);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.quotes.loadError' })
      );
    }
    throw error;
  }
};

export const getQuote = async (id: number): Promise<Quote> => {
  try {
    const response = await quotesApi.getQuote(id);
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.quote.loadError' })
      );
    }
    throw error;
  }
};

export const createQuote = async (quoteData: QuoteFormData): Promise<Quote> => {
  try {
    const response = await quotesApi.createQuote(quoteData);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.quote.created' }));
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.quote.createError' });
    }
    throw error;
  }
};

export const updateQuote = async (
  id: number,
  quoteData: Partial<QuoteFormData>
): Promise<Quote> => {
  try {
    const response = await quotesApi.updateQuote(id, quoteData);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.quote.updated' }));
    return response;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.quote.updateError' });
    }
    throw error;
  }
};

export const deleteQuote = async (id: number): Promise<void> => {
  try {
    await quotesApi.deleteQuote(id);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.quote.deleted' }));
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.quote.deleteError' })
      );
    }
    throw error;
  }
};

export const getProjectQuotes = async (
  projectId: number,
  filters: QuoteFilters = {}
): Promise<{
  data: Quote[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> => {
  try {
    const response = await quotesApi.getProjectQuotes({ ...filters, project_id: projectId });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.quotes.loadError' })
      );
    }
    throw error;
  }
};

export const getClientQuotes = async (
  clientId: number,
  filters: QuoteFilters = {}
): Promise<{
  data: Quote[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
}> => {
  try {
    const response = await quotesApi.getClientQuotes({ ...filters, client_id: clientId });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.quotes.loadError' })
      );
    }
    throw error;
  }
};

export const getNextQuoteNumber = async (): Promise<string> => {
  try {
    const nextNumber = await quotesApi.getNextQuoteNumber();
    return nextNumber;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        getIntl(locale).formatMessage({ id: error.response?.data?.message }) ||
          getIntl(locale).formatMessage({ id: 'toast.quote.nextNumberError' })
      );
    }
    throw error;
  }
};
