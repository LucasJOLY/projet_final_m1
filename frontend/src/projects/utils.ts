import type { ProjectStatus, ProjectStatusOption } from './types';

export const PROJECT_STATUS_OPTIONS: ProjectStatusOption[] = [
  {
    value: 0,
    label: 'projects.status.prospect',
    color: '#ffffff',
    backgroundColor: '#6b7280',
  },
  {
    value: 1,
    label: 'projects.status.devis_envoye',
    color: '#ffffff',
    backgroundColor: '#f59e0b',
  },
  {
    value: 2,
    label: 'projects.status.devis_accepte',
    color: '#ffffff',
    backgroundColor: '#3b82f6',
  },
  {
    value: 3,
    label: 'projects.status.demarre',
    color: '#ffffff',
    backgroundColor: '#10b981',
  },
  {
    value: 4,
    label: 'projects.status.termine',
    color: '#ffffff',
    backgroundColor: '#059669',
  },
  {
    value: 5,
    label: 'projects.status.annule',
    color: '#ffffff',
    backgroundColor: '#ef4444',
  },
];

export const getProjectStatusOption = (status: ProjectStatus): ProjectStatusOption => {
  return (
    PROJECT_STATUS_OPTIONS.find((option) => option.value === status) || PROJECT_STATUS_OPTIONS[0]
  );
};

export const getProjectStatusColor = (
  status: ProjectStatus
): { color: string; backgroundColor: string } => {
  const option = getProjectStatusOption(status);
  return {
    color: option.color,
    backgroundColor: option.backgroundColor,
  };
};
