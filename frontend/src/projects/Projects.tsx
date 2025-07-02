import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  useTheme,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  OutlinedInput,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchProjects, deleteProjectAction } from './store/slice';
import { fetchClients } from '../clients/store/slice';
import type { Project, ProjectSearchParams, ProjectStatus } from './types';
import type { Client } from '../clients/types';
import { PROJECT_STATUS_OPTIONS, getProjectStatusColor } from './utils';
import { getClientDisplayName, getClientTypeIcon } from '../clients/utils';
import { GRID_DEFAULT_LOCALE_TEXT_FR } from '../utils/DataGridLocaleFR';
import { GRID_DEFAULT_LOCALE_TEXT_EN } from '../utils/DataGridLocaleEN';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';

const Projects: React.FC = () => {
  const isDarkMode = useTheme().palette.mode === 'dark';
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const locale = localStorage.getItem('language') || 'fr';

  const { projects, loading, pagination } = useSelector((state: RootState) => state.projects);
  const { clients } = useSelector((state: RootState) => state.clients);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>([3]);
  const [selectedClientId, setSelectedClientId] = useState<number | ''>('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 50,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  // Charger les clients au début
  useEffect(() => {
    dispatch(fetchClients({}));
  }, [dispatch]);

  // Recharger les projets quand les filtres changent
  useEffect(() => {
    loadProjects();
  }, [sortModel, paginationModel, selectedStatuses, selectedClientId]);

  // Charger les projets avec les paramètres de recherche et pagination
  const loadProjects = () => {
    const params: ProjectSearchParams = {
      per_page: paginationModel.pageSize,
      page: paginationModel.page + 1,
      status: selectedStatuses,
    };

    // Ajouter les paramètres de tri
    if (sortModel.length > 0) {
      params.sort_by = sortModel[0].field;
      params.sort_order = sortModel[0].sort as 'asc' | 'desc';
    }

    // Ajouter le paramètre de recherche global
    if (searchTerm.trim()) {
      params.search = searchTerm.trim();
    }

    // Ajouter le filtre client
    if (selectedClientId) {
      params.client_id = selectedClientId as number;
    }

    dispatch(fetchProjects(params));
  };

  // Gérer la recherche
  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: 50 });
    loadProjects();
  };

  // Gérer la suppression d'un projet
  const handleDelete = async (id: number) => {
    const project = projects.find((p: Project) => p.id === id);
    setProjectToDelete(project || null);
    setDeleteModalOpen(true);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (projectToDelete) {
      try {
        await dispatch(deleteProjectAction(projectToDelete.id)).unwrap();
        loadProjects(); // Recharger la liste
        setDeleteModalOpen(false);
        setProjectToDelete(null);
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setProjectToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedStatuses([3]);
    setSelectedClientId('');
    setSearchTerm('');
    setPaginationModel({ page: 0, pageSize: 50 });
  };

  // Colonnes du DataGrid
  const columns: GridColDef<Project>[] = [
    {
      field: 'name',
      headerName: intl.formatMessage({ id: 'projects.columns.name' }),
      flex: 1,
      minWidth: 200,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'client',
      headerName: intl.formatMessage({ id: 'projects.columns.client' }),
      flex: 1,
      minWidth: 200,
      type: 'string',
      sortable: true,
      filterable: false,
      renderCell: (params: any) => {
        console.log(params);
        const icon = getClientTypeIcon(params.row.client);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {icon}
            {params ? getClientDisplayName(params.row.client) : ''}
          </Box>
        );
      },
    },
    {
      field: 'status',
      headerName: intl.formatMessage({ id: 'projects.columns.status' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      renderCell: (params: any) => {
        const { color, backgroundColor } = getProjectStatusColor(params.value);
        const label = PROJECT_STATUS_OPTIONS.find((option) => option.value === params.value)?.label;
        return (
          <Chip
            label={intl.formatMessage({ id: label })}
            size='small'
            sx={{
              color,
              backgroundColor,
              fontWeight: 'bold',
              fontSize: '0.75rem',
            }}
          />
        );
      },
    },
    {
      field: 'created_at',
      headerName: intl.formatMessage({ id: 'projects.columns.createdAt' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      type: 'date',
      valueFormatter: (params: any) => {
        if (!params) return '';
        const date = new Date(params);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: intl.formatMessage({ id: 'projects.columns.actions' }),
      width: 120,
      sortable: false,
      filterable: false,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label={intl.formatMessage({ id: 'projects.actions.view' })}
          onClick={() => navigate(`/projects/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label={intl.formatMessage({ id: 'projects.actions.edit' })}
          onClick={() => navigate(`/projects/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color='error' />}
          label={intl.formatMessage({ id: 'projects.actions.delete' })}
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ];

  // Afficher le loader lors du chargement initial
  if (loading && projects?.length === 0) {
    return (
      <Box sx={{ p: 3 }}>
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
          gap: { xs: 2, sm: 0 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}
      >
        <Typography
          variant='h4'
          component='h1'
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {intl.formatMessage({ id: 'projects.title' })}
        </Typography>
        <PrimaryButton startIcon={<AddIcon />} onClick={() => navigate('/projects/add')}>
          {intl.formatMessage({ id: 'projects.add' })}
        </PrimaryButton>
      </Box>

      {/* Barre de filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '10px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '2fr 1fr 1fr auto',
            },
            gap: 2,
            alignItems: 'flex-end',
          }}
        >
          {/* Recherche */}
          <TextField
            fullWidth
            variant='outlined'
            label={intl.formatMessage({ id: 'projects.search.label' })}
            placeholder={intl.formatMessage({ id: 'projects.search.placeholder' })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton onClick={handleSearch}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* Filtre par statut */}
          <FormControl fullWidth>
            <InputLabel>{intl.formatMessage({ id: 'projects.filters.status' })}</InputLabel>
            <Select
              multiple
              value={selectedStatuses}
              onChange={(e) => setSelectedStatuses(e.target.value as ProjectStatus[])}
              input={
                <OutlinedInput label={intl.formatMessage({ id: 'projects.filters.status' })} />
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={intl.formatMessage({
                        id: PROJECT_STATUS_OPTIONS.find((option) => option.value === value)?.label,
                      })}
                      size='small'
                    />
                  ))}
                </Box>
              )}
            >
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {intl.formatMessage({ id: option.label })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Filtre par client */}
          <FormControl fullWidth>
            <InputLabel>{intl.formatMessage({ id: 'projects.filters.client' })}</InputLabel>
            <Select
              value={selectedClientId}
              onChange={(e) => setSelectedClientId(e.target.value as number | '')}
              label={intl.formatMessage({ id: 'projects.filters.client' })}
            >
              <MenuItem value=''>
                <em>{intl.formatMessage({ id: 'common.all' }) || 'Tous'}</em>
              </MenuItem>
              {clients.map((client: Client) => (
                <MenuItem key={client.id} value={client.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getClientTypeIcon(client)}
                    {getClientDisplayName(client)}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Bouton de réinitialisation */}
          <PrimaryButton variant='outlined' startIcon={<FilterIcon />} onClick={handleResetFilters}>
            {intl.formatMessage({ id: 'projects.filters.reset' })}
          </PrimaryButton>
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper sx={{ height: 600, width: '100%', borderRadius: '10px' }}>
        <DataGrid
          rows={projects}
          columns={columns}
          pagination
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[50]}
          rowCount={pagination?.total || 0}
          paginationMode='server'
          sortingMode='server'
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          localeText={locale === 'fr' ? GRID_DEFAULT_LOCALE_TEXT_FR : GRID_DEFAULT_LOCALE_TEXT_EN}
          disableRowSelectionOnClick
          sx={{
            borderRadius: '10px',
            border: 'none',
            backgroundColor: isDarkMode ? '#273142' : '#fff',
            '& .MuiDataGrid-scrollbar': {
              borderRadius: '10px',
              backgroundColor: isDarkMode ? '#273142' : '#fff',
            },
            '& .MuiDataGrid-columnHeaders ': {
              borderRadius: '10px',
              border: 'none',
              backgroundColor: isDarkMode ? '#273142' : '#fff',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: isDarkMode ? '#273142' : '#fff',
              borderBottom: isDarkMode
                ? '1px solid #1b2431 !important'
                : '1px solid #e0e0e0 !important',
            },
            '& .MuiDataGrid-overlay': {
              backgroundColor: isDarkMode ? '#273142' : '#fff',
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: isDarkMode ? '1px solid #1b2431' : '1px solid #e0e0e0',
            },

            '& *::-webkit-scrollbar': {
              borderTop: isDarkMode ? '1px solid #1b2431' : '1px solid #e0e0e0',
              width: '8px',
              height: '8px',
            },
            '& *::-webkit-scrollbar-thumb': {
              backgroundColor: isDarkMode ? '#4a5568' : '#c1c1c1',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: isDarkMode ? '#718096' : '#a8a8a8',
              },
            },
          }}
        />
      </Paper>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        open={deleteModalOpen}
        title={intl.formatMessage({ id: 'projects.delete.title' })}
        message={intl.formatMessage(
          { id: 'projects.delete.message' },
          { name: projectToDelete?.name || '' }
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={intl.formatMessage({ id: 'projects.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default Projects;
