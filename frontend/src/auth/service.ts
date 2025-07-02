import type { PasswordStrength } from './types';
import { toast } from 'react-toastify';
import { checkEmail } from './api/authAPI';
import { getIntl } from '../language/config/translation';
import axios from 'axios';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

const locale = localStorage.getItem('locale') || 'fr';

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
    toast.error(getIntl(locale).formatMessage({ id: 'toast.passwordTooWeak' }));
    throw new Error();
  }
};

export const validateEmail = async (email: string) => {
  const response = await checkEmail(email);
  if (response && response?.exists) {
    toast.error(getIntl(locale).formatMessage({ id: 'toast.emailAlreadyUsed' }));
    throw new Error();
  }
};

export const setTokens = (tokens: TokenResponse, stayConnected: boolean = false) => {
  const storage = stayConnected ? localStorage : sessionStorage;
  storage.setItem('access_token', tokens.access_token);
  storage.setItem('refresh_token', tokens.refresh_token);
  storage.setItem('token_expiry', String(Date.now() + tokens.expires_in * 1000));
};

export const getTokens = () => {
  const storage = localStorage.getItem('access_token') ? localStorage : sessionStorage;
  return {
    access_token: storage.getItem('access_token'),
    refresh_token: storage.getItem('refresh_token'),
    token_expiry: storage.getItem('token_expiry'),
  };
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expiry');
  sessionStorage.removeItem('access_token');
  sessionStorage.removeItem('refresh_token');
  sessionStorage.removeItem('token_expiry');
};

export const isTokenExpired = () => {
  const { token_expiry } = getTokens();
  if (!token_expiry) return true;
  return Date.now() > parseInt(token_expiry);
};

export const refreshToken = async () => {
  const { refresh_token } = getTokens();
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await axios.post<TokenResponse>(
      `${import.meta.env.VITE_BACKEND_URL}/account/refresh`,
      {
        refresh_token,
      }
    );

    const { access_token, refresh_token: newRefreshToken, expires_in } = response.data;
    setTokens({ access_token, refresh_token: newRefreshToken, expires_in });
    return access_token;
  } catch (error) {
    clearTokens();
    throw error;
  }
};
