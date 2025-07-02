import { toast } from 'react-toastify';
import { configAPI } from '../../config/apiConfig';
import { AxiosError } from 'axios';
import { getIntl } from '../../language/config/translation';
import type { User } from '../../auth/types';
import type { UpdateProfileData } from '../types';

const locale = localStorage.getItem('locale') || 'fr';

export const getProfile = async (): Promise<User> => {
  try {
    const response = await configAPI.get('account/user');
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message ||
          getIntl(locale).formatMessage({ id: 'toast.profileLoadError' })
      );
    }
    throw error;
  }
};

export const updateProfile = async (data: UpdateProfileData): Promise<User> => {
  try {
    const updateData = { ...data };
    delete updateData.confirmPassword;

    if (!updateData.password) {
      delete updateData.password;
    }

    const response = await configAPI.put(`accounts/${data.id}`, updateData);
    toast.success(getIntl(locale).formatMessage({ id: 'toast.profileUpdated' }));
    return response.data.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(
        error.response?.data?.message ||
          getIntl(locale).formatMessage({ id: 'toast.profileUpdateError' })
      );
    }
    throw error;
  }
};
