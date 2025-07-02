import { toast } from 'react-toastify';
import type { Invoice, InvoiceStatus } from './types';
import { getIntl } from '../language/config/translation';

const locale = localStorage.getItem('locale') || 'fr';

// Options pour les statuts de facture
export const INVOICE_STATUS_OPTIONS = [
  { value: 0, label: 'invoices.status.draft' },
  { value: 1, label: 'invoices.status.edited' },
  { value: 2, label: 'invoices.status.sent' },
  { value: 3, label: 'invoices.status.paid' },
] as const;

// Options pour les types de paiement
export const PAYMENT_TYPE_OPTIONS = [
  { value: 'bank_transfer', label: 'invoices.paymentType.bankTransfer' },
  { value: 'check', label: 'invoices.paymentType.check' },
  { value: 'paypal', label: 'invoices.paymentType.paypal' },
  { value: 'other', label: 'invoices.paymentType.other' },
] as const;

/**
 * Formate le numéro de facture
 */
export const formatInvoiceNumber = (invoiceNumber: string): string => {
  return invoiceNumber;
};

export const getInvoicePaymentTypeLabel = (paymentType: string): string => {
  const option = PAYMENT_TYPE_OPTIONS.find((opt) => opt.value === paymentType);
  return option ? option.label : paymentType;
};

/**
 * Formate un prix en euros
 */
export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
};

export const checkInvoiceNumber = (invoiceNumber: string, invoiceMinNumber: string): boolean => {
  // si l'invoice number contient FAC- on l'enlève
  if (invoiceNumber.includes('FAC-')) {
    invoiceNumber = invoiceNumber.replace('FAC-', '');
  }
  if (invoiceMinNumber.includes('FAC-')) {
    invoiceMinNumber = invoiceMinNumber.replace('FAC-', '');
  }

  // si le numéro est vide ou alors ne contient pas de chiffre alors on toast une erreur
  if (!invoiceNumber || !/^\d+$/.test(invoiceNumber)) {
    toast.error(getIntl(locale).formatMessage({ id: 'invoices.number.empty' }));
    return false;
  }

  // on transforme en int
  const invoiceNumberInt = parseInt(invoiceNumber);
  const invoiceMinNumberInt = parseInt(invoiceMinNumber);
  // si c'est plus petit que le min alors on toast une erreur
  if (invoiceNumberInt < invoiceMinNumberInt) {
    toast.error(
      getIntl(locale).formatMessage(
        {
          id: 'invoices.number.tooSmall',
        },
        {
          minNumber: invoiceMinNumberInt,
        }
      )
    );
    return false;
  }

  return true;
};

/**
 * Calcule le total d'une facture
 */
export const getInvoiceTotal = (invoice: Invoice): number => {
  if (!invoice.invoice_lines || invoice.invoice_lines.length === 0) {
    return 0;
  }

  return invoice.invoice_lines.reduce((total, line) => {
    return total + line.unit_price * line.quantity;
  }, 0);
};

/**
 * Obtient la couleur associée au statut de la facture
 */
export const getInvoiceStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case 0: // brouillon
      return { color: '#666', backgroundColor: '#f0f0f0' };
    case 1: // éditée
      return { color: '#1976d2', backgroundColor: '#e3f2fd' };
    case 2: // envoyée
      return { color: '#ed6c02', backgroundColor: '#fff3e0' };
    case 3: // payée
      return { color: '#2e7d32', backgroundColor: '#e8f5e8' };
    default:
      return { color: '#666', backgroundColor: '#f0f0f0' };
  }
};

/**
 * Obtient le label du statut de la facture
 */
export const getInvoiceStatusLabel = (status: InvoiceStatus): string => {
  const option = INVOICE_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option ? option.label : 'invoices.status.unknown';
};

export const calculateInvoiceTotal = (
  invoiceLines: Array<{ unit_price: number; quantity: number }>
): number => {
  return invoiceLines.reduce((total, line) => total + line.unit_price * line.quantity, 0);
};

/**
 * Vérifie si une facture peut être modifiée
 */
export const canEditInvoice = (status: InvoiceStatus): boolean => {
  return status !== 3; // 3 = payée
};

/**
 * Vérifie si une facture peut être supprimée
 */
export const canDeleteInvoice = (status: InvoiceStatus): boolean => {
  return status !== 3; // 3 = payée
};

/**
 * Vérifie si une facture est en retard
 */
export const isInvoiceOverdue = (invoice: Invoice): boolean => {
  if (invoice.status !== 2) return false; // Seulement pour les factures envoyées

  const now = new Date();
  const dueDate = new Date(invoice.payment_due_date);

  return now > dueDate;
};

/**
 * Vérifie si une facture peut être envoyée ou payée
 */
export const canInvoiceBeProcessed = (invoice: Invoice): boolean => {
  // Doit être éditée et avoir des lignes
  return invoice.status >= 1 && !!invoice.invoice_lines && invoice.invoice_lines.length > 0;
};

/**
 * Obtient le label du type de paiement
 */
export const getPaymentTypeLabel = (paymentType: string): string => {
  const option = PAYMENT_TYPE_OPTIONS.find((opt) => opt.value === paymentType);
  return option ? option.label : paymentType;
};
