import { toast } from 'react-toastify';
import type { QuoteStatus, Quote, QuoteLine } from './types';
import { getIntl } from '../language/config/translation';

const locale = localStorage.getItem('locale') || 'fr';

export const QUOTE_STATUS_OPTIONS = [
  {
    value: 0 as QuoteStatus,
    label: 'quotes.status.sent',
    color: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  {
    value: 1 as QuoteStatus,
    label: 'quotes.status.accepted',
    color: '#2e7d32',
    backgroundColor: '#e8f5e8',
  },
  {
    value: 2 as QuoteStatus,
    label: 'quotes.status.rejected',
    color: '#d32f2f',
    backgroundColor: '#ffebee',
  },
];

export const getQuoteStatusColor = (status: QuoteStatus) => {
  const statusOption = QUOTE_STATUS_OPTIONS.find((option) => option.value === status);
  return {
    color: statusOption?.color || '#666',
    backgroundColor: statusOption?.backgroundColor || '#f5f5f5',
  };
};

export const getQuoteStatusLabel = (status: QuoteStatus) => {
  const statusOption = QUOTE_STATUS_OPTIONS.find((option) => option.value === status);
  return statusOption?.label || 'quotes.status.unknown';
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatQuoteNumber = (quoteNumber: string | number): string => {
  // si il contient deja DEV-
  if (quoteNumber.toString().includes('DEV-')) {
    return quoteNumber.toString();
  }
  return `DEV-${quoteNumber}`;
};

export const calculateQuoteTotal = (
  quoteLines: Array<{ unit_price: number; quantity: number }>
): number => {
  return quoteLines.reduce((total, line) => total + line.unit_price * line.quantity, 0);
};

export const canDeleteQuote = (status: QuoteStatus): boolean => {
  return status !== 1; // Cannot delete accepted quotes
};

export const canEditQuote = (status: QuoteStatus): boolean => {
  return status !== 1; // Cannot edit accepted quotes
};

export const getQuoteTotal = (quote: Quote): number => {
  return quote.total || calculateQuoteTotal(quote.quote_lines || []);
};

export const verifyQuoteNumber = (quoteNumber: string): boolean => {
  // doit avoir le format DEV-0000000000
  if (!quoteNumber.match(/^DEV-\d+$/)) {
    toast.error(getIntl(locale).formatMessage({ id: 'toast.quote.invalidNumber' }));
    return false;
  }
  return true;
};
