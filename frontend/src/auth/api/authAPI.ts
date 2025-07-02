import { toast } from 'react-toastify';
import { configAPI } from '../../config/apiConfig';
import { AxiosError } from 'axios';
import { getIntl } from '../../language/config/translation';
import type { User, AuthResponse } from '../types';
import { getErrorValidationMessage } from '../../utils/utils';

const locale = localStorage.getItem('locale') || 'fr';

export const register = async (
  email: string,
  password: string,
  name: string,
  first_name: string,
  birth_date: string,
  address: string,
  city: string,
  phone: string,
  max_annual_revenue: number,
  expense_rate: number,
  confirm_password: string
): Promise<AuthResponse> => {
  try {
    const response = await configAPI.post(`account/register`, {
      email,
      password,
      name,
      first_name,
      birth_date,
      address,
      city,
      phone,
      max_annual_revenue,
      expense_rate,
      confirm_password,
    });
    toast.success(getIntl(locale).formatMessage({ id: response.data.message }));
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      getErrorValidationMessage(error.response?.data?.errors) ||
        getIntl(locale).formatMessage({ id: 'toast.registrationError' });
    }
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await configAPI.post(`account/login`, {
      email,
      password,
    });
    toast.success(getIntl(locale).formatMessage({ id: response.data.message }));
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data === 'Incorrect password') {
      toast.error(getIntl(locale).formatMessage({ id: 'toast.wrongPassword' }));
    } else if (error instanceof AxiosError && error.response?.data === 'Incorrect email') {
      toast.error(getIntl(locale).formatMessage({ id: 'toast.wrongEmail' }));
    } else {
      toast.error(getIntl(locale).formatMessage({ id: 'toast.loginError' }));
    }
    throw error;
  }
};

export const getUser = async (userId: number): Promise<User> => {
  const response = await configAPI.get(`accounts/${userId}`);

  const user: User = response.data.data;
  return user;
};

export const checkEmail = async (email: string): Promise<{ exists: boolean }> => {
  const response = await configAPI.get(`account/check-email?email=${email}`);
  return response.data.data;
};

export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await configAPI.post('forgot-password', { email });
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message ||
          getIntl(locale).formatMessage({ id: 'toast.resetPasswordError' })
      );
    }
    throw error;
  } finally {
    toast.success(getIntl(locale).formatMessage({ id: 'toast.emailSentResetPassword' }));
  }
};

export const resetPassword = async (token: string, password: string): Promise<void> => {
  try {
    await configAPI.post('reset-password', { token, password });
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message ||
          getIntl(locale).formatMessage({ id: 'toast.resetPasswordError' })
      );
    }
    throw error;
  }
};

export const verifyResetToken = async (token: string): Promise<{ valid: boolean }> => {
  try {
    const response = await configAPI.get(`verify-reset-token/${token}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message ||
          getIntl(locale).formatMessage({ id: 'toast.resetPasswordError' })
      );
    }
    throw error;
  }
};
