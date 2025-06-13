import type { PasswordStrength } from './types';
import { toast } from 'react-toastify';
import { checkEmail } from './api/authAPI';
import { getIntl } from '../language/config/translation';

export const calculatePasswordStrength = (pass: string): PasswordStrength => {
  let score = 0;
  if (pass.length > 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  const strengthMap: { [key: number]: PasswordStrength } = {
    0: { score: 33, label: 'weak', color: '#f44336' },
    1: { score: 33, label: 'weak', color: '#f44336' },
    2: { score: 66, label: 'medium', color: '#ffa726' },
    3: { score: 100, label: 'strong', color: '#4caf50' },
    4: { score: 100, label: 'strong', color: '#4caf50' },
  };

  return strengthMap[score];
};

export const validatePassword = (password: string) => {
  const strength = calculatePasswordStrength(password);
  if (strength.score < 66) {
    toast.error(getIntl('fr').formatMessage({ id: 'toast.passwordTooWeak' }));
    throw new Error();
  }
};

export const validateEmail = async (email: string) => {
  const response = await checkEmail(email);
  if (response && response?.exists) {
    toast.error(getIntl('fr').formatMessage({ id: 'toast.emailAlreadyUsed' }));
    throw new Error();
  }
};
