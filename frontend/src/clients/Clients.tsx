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
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchClients, deleteClientAction } from './store/slice';
import type { Client, ClientSearchParams } from './types';
import { getClientDisplayName, getClientTypeIcon, getClientTypeLabel } from './utils';
import { GRID_DEFAULT_LOCALE_TEXT_FR } from '../utils/DataGridLocaleFR';
import { GRID_DEFAULT_LOCALE_TEXT_EN } from '../utils/DataGridLocaleEN';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';

const Clients: React.FC = () => {
  const isDarkMode = useTheme().palette.mode === 'dark';
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const locale = localStorage.getItem('language') || 'fr';

  const { clients, loading, pagination } = useSelector((state: RootState) => state.clients);

  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 50,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Recharger les clients quand le tri change
  useEffect(() => {
    loadClients();
  }, [sortModel, paginationModel]);

  // Charger les clients avec les paramètres de recherche et pagination
  const loadClients = () => {
    const params: ClientSearchParams = {
      per_page: paginationModel.pageSize,
      page: paginationModel.page + 1,
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

    dispatch(fetchClients(params));
  };

  // Gérer la recherche
  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: 50 });
    loadClients();
  };

  // Gérer la suppression d'un client
  const handleDelete = async (id: number) => {
    const client = clients.find((c) => c.id === id);
    setClientToDelete(client || null);
    setDeleteModalOpen(true);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (clientToDelete) {
      try {
        await dispatch(deleteClientAction(clientToDelete.id)).unwrap();
        loadClients(); // Recharger la liste
        setDeleteModalOpen(false);
        setClientToDelete(null);
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setClientToDelete(null);
  };

  // Colonnes du DataGrid
  const columns: GridColDef<Client>[] = [
    {
      field: 'is_company',
      headerName: intl.formatMessage({ id: 'clients.columns.type' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      renderCell: (params: any) => {
        const icon = getClientTypeIcon(params.row);
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            {icon}
            <Typography variant='body2'>
              {intl.formatMessage({ id: getClientTypeLabel(params.value) })}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'name',
      headerName: intl.formatMessage({ id: 'clients.columns.name' }),
      flex: 1,
      minWidth: 200,
      type: 'string',
      sortable: true,
      filterable: false,
    },

    {
      field: 'contact_name',
      headerName: intl.formatMessage({ id: 'clients.columns.contactName' }),
      flex: 1,
      minWidth: 150,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'contact_first_name',
      headerName: intl.formatMessage({ id: 'clients.columns.contactFirstName' }),
      flex: 1,
      minWidth: 150,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'city',
      headerName: intl.formatMessage({ id: 'clients.columns.city' }),
      flex: 1,
      minWidth: 120,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'email',
      headerName: intl.formatMessage({ id: 'clients.columns.email' }),
      flex: 1,
      minWidth: 200,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'phone',
      headerName: intl.formatMessage({ id: 'clients.columns.phone' }),
      flex: 1,
      minWidth: 120,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'created_at',
      headerName: intl.formatMessage({ id: 'clients.columns.createdAt' }),
      flex: 1,
      minWidth: 120,
      type: 'date',
      valueFormatter: (params: any) => {
        if (!params) return '';
        const date = new Date(params);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
      sortable: true,
      filterable: false,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: intl.formatMessage({ id: 'clients.columns.actions' }),
      width: 120,
      sortable: false,
      filterable: false,
      getActions: (params: any) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label={intl.formatMessage({ id: 'clients.actions.view' })}
          onClick={() => navigate(`/clients/${params.id}`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label={intl.formatMessage({ id: 'clients.actions.edit' })}
          onClick={() => navigate(`/clients/${params.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon color='error' />}
          label={intl.formatMessage({ id: 'clients.actions.delete' })}
          onClick={() => handleDelete(params.id as number)}
        />,
      ],
    },
  ];

  // Afficher le loader lors du chargement initial
  if (loading && clients.length === 0) {
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 },
          mb: 3,
        }}
      >
        <Typography
          variant='h4'
          component='h1'
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {intl.formatMessage({ id: 'clients.title' })}
        </Typography>
        <PrimaryButton startIcon={<AddIcon />} onClick={() => navigate('/clients/add')}>
          {intl.formatMessage({ id: 'clients.add' })}
        </PrimaryButton>
      </Box>

      {/* Barre de recherche */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '10px' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant='outlined'
            placeholder={intl.formatMessage({ id: 'clients.search.placeholder' })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper sx={{ height: 600, width: '100%', borderRadius: '10px' }}>
        <DataGrid
          rows={clients}
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
        title={intl.formatMessage({ id: 'clients.delete.title' })}
        message={intl.formatMessage(
          { id: 'clients.delete.message' },
          { name: clientToDelete?.name || '' }
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={intl.formatMessage({ id: 'clients.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default Clients;
