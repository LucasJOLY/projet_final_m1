import type { User } from '../auth/types';

// Obtenir le nom complet d'un compte
export const getAccountFullName = (account: User): string => {
  console.log(account.first_name, account.name);
  return `${account.first_name} ${account.name}`.trim();
};

// Formater le revenu annuel avec le symbole €
export const formatRevenue = (revenue: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(revenue);
};

// Formater le taux de dépenses avec le symbole %
export const formatExpenseRate = (rate: number): string => {
  return `${rate.toFixed(2)} %`;
};

// Obtenir le label du statut admin
export const getAdminStatusLabel = (isAdmin: boolean): string => {
  return isAdmin ? 'accounts.status.admin' : 'accounts.status.user';
};

// Vérifier si un compte peut être modifié (les admins ne peuvent pas être rétrogradés)
export const canModifyAccount = (account: User, currentUser: User): boolean => {
  // Un admin ne peut pas se modifier lui-même
  if (account.id === currentUser.id) {
    return false;
  }
  // Un admin ne peut pas modifier un autre admin
  if (account.is_admin && currentUser.is_admin) {
    return false;
  }
  return true;
};

// Vérifier si un compte peut être supprimé
export const canDeleteAccount = (account: User, currentUser: User): boolean => {
  // Un compte ne peut pas se supprimer lui-même
  if (account.id === currentUser.id) {
    return false;
  }
  // Un admin ne peut pas supprimer un autre admin
  if (account.is_admin) {
    return false;
  }
  return true;
};

// Vérifier si un compte peut être passé en admin
export const canMakeAdmin = (account: User, currentUser: User): boolean => {
  // Ne peut pas passer en admin si c'est déjà un admin
  if (account.is_admin) {
    return false;
  }
  // Ne peut pas se passer en admin soi-même
  if (account.id === currentUser.id) {
    return false;
  }
  // Seul un admin peut passer quelqu'un en admin
  return currentUser.is_admin;
};
