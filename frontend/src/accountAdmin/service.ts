import { toast } from 'react-toastify';
import { accountAdminAPI } from './api/accountAdminAPI';
import type { AccountSearchParams, AccountUpdateData } from './types';

import { getIntl } from '../language/config/translation';

const locale = localStorage.getItem('locale') || 'fr';
export const accountAdminService = {
  // Récupérer la liste des comptes
  async getAccounts(params?: AccountSearchParams) {
    try {
      const response = await accountAdminAPI.getAccounts(params);
      return response;
    } catch (error: any) {
      console.error('Erreur lors du chargement des comptes:', error);
      toast.error(getIntl(locale).formatMessage({ id: 'toast.accounts.loadError' }));
      throw error;
    }
  },

  // Récupérer un compte par ID
  async getAccount(id: number) {
    try {
      const response = await accountAdminAPI.getAccount(id);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors du chargement du compte:', error);
      toast.error(getIntl(locale).formatMessage({ id: 'toast.account.loadError' }));
      throw error;
    }
  },

  // Mettre à jour un compte
  async updateAccount(id: number, data: AccountUpdateData) {
    try {
      const response = await accountAdminAPI.updateAccount(id, data);
      toast.success(getIntl(locale).formatMessage({ id: 'toast.account.updated' }));
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du compte:', error);
      toast.error(getIntl(locale).formatMessage({ id: 'toast.account.updateError' }));
      throw error;
    }
  },

  // Supprimer un compte
  async deleteAccount(id: number) {
    try {
      await accountAdminAPI.deleteAccount(id);
      toast.success(getIntl(locale).formatMessage({ id: 'toast.account.deleted' }));
    } catch (error: any) {
      console.error('Erreur lors de la suppression du compte:', error);
      toast.error(getIntl(locale).formatMessage({ id: 'toast.account.deleteError' }));
      throw error;
    }
  },

  // Passer un compte en admin
  async makeAdmin(id: number) {
    try {
      const response = await accountAdminAPI.makeAdmin(id);
      toast.success(getIntl(locale).formatMessage({ id: 'toast.account.madeAdmin' }));
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors du passage en admin:', error);
      toast.error(getIntl(locale).formatMessage({ id: 'toast.account.makeAdminError' }));
      throw error;
    }
  },
};
