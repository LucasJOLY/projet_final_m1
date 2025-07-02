import { getIntl } from '../language/config/translation';
import type { UpdateProfileData } from './types';

const locale = localStorage.getItem('locale') || 'fr';

export const validateProfileData = (data: UpdateProfileData): string[] => {
  console.log(data);
  const errors: string[] = [];

  if (!data.name || data.name.trim().length === 0) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.required' }));
  }

  if (!data.first_name || data.first_name.trim().length === 0) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.required' }));
  }

  if (!data.email || data.email.trim().length === 0) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.required' }));
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.email' }));
  }

  if (!data.birth_date) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.required' }));
  } else if (new Date(data.birth_date) > new Date()) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.birthDate' }));
  }

  if (!data.address || data.address.trim().length === 0) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.required' }));
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.required' }));
  } else if (!/^[0-9]{10}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.phone' }));
  }

  if (data.max_annual_revenue < 0) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.maxAnnualRevenueMin' }));
  }

  if (data.expense_rate < 0 || data.expense_rate > 100) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.expenseRateRange' }));
  }

  if (data.password && data.password.length > 0 && data.password.length < 8) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.passwordLength' }));
  }

  if (
    data.password &&
    data.password.length > 0 &&
    data.confirmPassword &&
    data.password !== data.confirmPassword
  ) {
    errors.push(getIntl(locale).formatMessage({ id: 'validation.passwordMatch' }));
  }

  return errors;
};

export const formatDateForDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateForInput = (dateString: string): string => {
  console.log(dateString);
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
};
