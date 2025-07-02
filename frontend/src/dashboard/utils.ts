import React from 'react';
import { FaUsers, FaEuroSign, FaTrophy, FaClockRotateLeft, FaFileInvoice } from 'react-icons/fa6';
import { MdWork } from 'react-icons/md';
import { TbTrendingUp, TbTrendingDown } from 'react-icons/tb';
import type { DashboardData, CardData } from './types';
import { formatCurrency, formatNumber, formatPercentage } from './service';

export const getPercentageIcon = (percentage: number) => {
  return percentage >= 0 ? React.createElement(TbTrendingUp) : React.createElement(TbTrendingDown);
};

export const getPercentageColor = (percentage: number): string => {
  return percentage >= 0 ? '#10b981' : '#ef4444';
};

export const createClientCard = (
  clientsData: DashboardData['clients'],
  title: string
): CardData => {
  const percentage = clientsData.percentage;
  const isPositive = percentage >= 0;

  return {
    title,
    value: formatNumber(clientsData.total),
    icon: React.createElement(FaUsers),
    additionalInfo: formatPercentage(percentage),
    isPositive,
    backgroundColor: '#3b82f6',
    iconColor: '#3b82f6',
  };
};

export const createProjectCard = (
  projectsData: DashboardData['projects'],
  title: string
): CardData => {
  const percentage = projectsData.percentage;
  const isPositive = percentage >= 0;

  return {
    title,
    value: formatNumber(projectsData.total),
    icon: React.createElement(MdWork),
    additionalInfo: formatPercentage(percentage),
    isPositive,
    backgroundColor: '#8b5cf6',
    iconColor: '#8b5cf6',
  };
};

export const createCurrentRevenueCard = (
  revenueData: DashboardData['revenue'],
  title: string
): CardData => {
  return {
    title,
    value: formatCurrency(revenueData.current),
    icon: React.createElement(FaEuroSign),
    backgroundColor: '#10b981',
    iconColor: '#10b981',
  };
};

export const createTargetRevenueCard = (
  revenueData: DashboardData['revenue'],
  title: string
): CardData => {
  return {
    title,
    value: formatCurrency(revenueData.target),
    icon: React.createElement(FaTrophy),
    backgroundColor: '#f59e0b',
    iconColor: '#f59e0b',
  };
};

export const createRemainingRevenueCard = (
  revenueData: DashboardData['revenue'],
  title: string,
  targetReachedText: string
): CardData => {
  const isTargetReached = revenueData.target_reached;

  return {
    title,
    value: isTargetReached
      ? `${targetReachedText} +${formatCurrency(Math.abs(revenueData.remaining))}`
      : formatCurrency(revenueData.remaining),
    icon: React.createElement(FaTrophy),
    backgroundColor: isTargetReached ? '#10b981' : '#6b7280',
    iconColor: isTargetReached ? '#10b981' : '#6b7280',
  };
};

export const createPendingPaymentsCard = (pendingPayments: number, title: string): CardData => {
  return {
    title,
    value: formatCurrency(pendingPayments),
    icon: React.createElement(FaClockRotateLeft),
    backgroundColor: '#f59e0b',
    iconColor: '#f59e0b',
  };
};

export const createDraftInvoicesCard = (draftInvoices: number, title: string): CardData => {
  return {
    title,
    value: formatCurrency(draftInvoices),
    icon: React.createElement(FaFileInvoice),
    backgroundColor: '#6b7280',
    iconColor: '#6b7280',
  };
};

export const createQuarterCards = (
  quarterData: any,
  labels: {
    paidRevenue: string;
    estimatedRevenue: string;
    expensesToPay: string;
    estimatedExpenses: string;
  }
): CardData[] => {
  return [
    {
      title: labels.paidRevenue,
      value: formatCurrency(quarterData.paid_revenue),
      icon: React.createElement(FaEuroSign),
      backgroundColor: '#10b981',
      iconColor: '#10b981',
    },
    {
      title: labels.estimatedRevenue,
      value: formatCurrency(quarterData.estimated_revenue),
      icon: React.createElement(FaEuroSign),
      backgroundColor: '#3b82f6',
      iconColor: '#3b82f6',
    },
    {
      title: labels.expensesToPay,
      value: formatCurrency(quarterData.expenses_to_pay),
      icon: React.createElement(FaEuroSign),
      backgroundColor: '#ef4444',
      iconColor: '#ef4444',
    },
    {
      title: labels.estimatedExpenses,
      value: formatCurrency(quarterData.estimated_expenses),
      icon: React.createElement(FaEuroSign),
      backgroundColor: '#f59e0b',
      iconColor: '#f59e0b',
    },
  ];
};
