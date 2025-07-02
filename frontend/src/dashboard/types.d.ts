export interface DashboardClientsData {
  total: number;
  current_year: number;
  last_year: number;
  percentage: number;
}

export interface DashboardProjectsData {
  total: number;
  current_year: number;
  last_year: number;
  percentage: number;
}

export interface DashboardRevenueData {
  current: number;
  target: number;
  remaining: number;
  target_reached: boolean;
}

export interface DashboardQuarterPeriod {
  start: string;
  end: string;
  start_formatted: string;
  end_formatted: string;
  quarter: 'current' | 'previous' | 'next';
}

export interface DashboardQuarterData {
  period: DashboardQuarterPeriod;
  paid_revenue: number;
  estimated_revenue: number;
  expenses_to_pay: number;
  estimated_expenses: number;
}

export interface DashboardData {
  clients: DashboardClientsData;
  projects: DashboardProjectsData;
  revenue: DashboardRevenueData;
  pending_payments: number;
  draft_invoices: number;
}

export interface DashboardMonthlyData {
  month: number;
  month_name: string;
  month_short: string;
  revenue: number;
}

export interface DashboardCumulativeData {
  month: number;
  month_name: string;
  month_short: string;
  cumulative_revenue: number;
}

export interface DashboardChartsData {
  monthly_revenue: DashboardMonthlyData[];
  cumulative_revenue: DashboardCumulativeData[];
  available_years: number[];
  selected_year: number;
}

export interface DashboardState {
  data: DashboardData | null;
  quarterData: DashboardQuarterData | null;
  chartsData: DashboardChartsData | null;
  loading: boolean;
  quarterLoading: boolean;
  chartsLoading: boolean;
  error: string | null;
}

export interface CardData {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  additionalInfo?: string;
  isPositive?: boolean;
  backgroundColor?: string;
  iconColor?: string;
}
