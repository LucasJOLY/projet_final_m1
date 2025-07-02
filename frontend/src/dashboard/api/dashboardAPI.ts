import { configAPI } from '../../config/apiConfig';
import type { DashboardData, DashboardQuarterData, DashboardChartsData } from '../types';

export const dashboardAPI = {
  // Récupérer les données principales du dashboard
  getDashboardData: async (): Promise<DashboardData> => {
    const response = await configAPI.get('/dashboard');
    return response.data.data;
  },

  // Récupérer les données trimestrielles
  getQuarterData: async (
    quarter: 'current' | 'previous' | 'next' = 'current'
  ): Promise<DashboardQuarterData> => {
    const response = await configAPI.get('/dashboard/quarter', {
      params: { quarter },
    });
    return response.data.data;
  },

  // Récupérer les données des graphiques
  getChartsData: async (year?: number): Promise<DashboardChartsData> => {
    const response = await configAPI.get('/dashboard/charts', {
      params: year ? { year } : {},
    });
    return response.data.data;
  },
};
