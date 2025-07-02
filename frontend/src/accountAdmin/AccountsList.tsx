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
  Chip,
} from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import type { GridColDef, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  PersonAdd as PersonAddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchAccounts, deleteAccountAction, makeAdminAction } from './store/slice';
import type { AccountSearchParams } from './types';
import {
  getAccountFullName,
  formatRevenue,
  formatExpenseRate,
  canDeleteAccount,
  canMakeAdmin,
} from './utils';
import { GRID_DEFAULT_LOCALE_TEXT_FR } from '../utils/DataGridLocaleFR';
import { GRID_DEFAULT_LOCALE_TEXT_EN } from '../utils/DataGridLocaleEN';
import ConfirmationModal from '../components/ConfirmationModal';
import type { User } from '../auth/types';

const AccountsList: React.FC = () => {
  const isDarkMode = useTheme().palette.mode === 'dark';
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const locale = localStorage.getItem('language') || 'fr';

  const {
    accounts = [],
    loading = false,
    pagination = null,
  } = useSelector((state: RootState) => state.accounts || {});
  const authUser = useSelector((state: RootState) => state.auth.authUser);

  const [searchTerm, setSearchTerm] = useState('');
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 50,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [makeAdminModalOpen, setMakeAdminModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<User | null>(null);
  const [accountToMakeAdmin, setAccountToMakeAdmin] = useState<User | null>(null);

  // Recharger les comptes quand le tri change
  useEffect(() => {
    loadAccounts();
  }, [sortModel, paginationModel]);

  // Charger les comptes avec les paramètres de recherche et pagination
  const loadAccounts = () => {
    const params: AccountSearchParams = {
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

    dispatch(fetchAccounts(params));
  };

  // Gérer la recherche
  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: 50 });
    loadAccounts();
  };

  // Gérer la suppression d'un compte
  const handleDelete = async (id: number) => {
    const account = accounts.find((a: User) => a.id === id);
    if (account && authUser && canDeleteAccount(account, authUser)) {
      setAccountToDelete(account);
      setDeleteModalOpen(true);
    }
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (accountToDelete) {
      try {
        await dispatch(deleteAccountAction(accountToDelete.id)).unwrap();
        loadAccounts(); // Recharger la liste
        setDeleteModalOpen(false);
        setAccountToDelete(null);
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setAccountToDelete(null);
  };

  // Gérer le passage en admin
  const handleMakeAdmin = async (id: number) => {
    const account = accounts.find((a) => a.id === id);
    if (account && authUser && canMakeAdmin(account, authUser)) {
      setAccountToMakeAdmin(account);
      setMakeAdminModalOpen(true);
    }
  };

  // Confirmer le passage en admin
  const handleConfirmMakeAdmin = async () => {
    if (accountToMakeAdmin) {
      try {
        await dispatch(makeAdminAction(accountToMakeAdmin.id)).unwrap();
        loadAccounts(); // Recharger la liste
        setMakeAdminModalOpen(false);
        setAccountToMakeAdmin(null);
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
  };

  // Annuler le passage en admin
  const handleCancelMakeAdmin = () => {
    setMakeAdminModalOpen(false);
    setAccountToMakeAdmin(null);
  };

  // Colonnes du DataGrid
  const columns: GridColDef<User>[] = [
    {
      field: 'is_admin',
      headerName: intl.formatMessage({ id: 'accounts.columns.status' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      renderCell: (params: any) => {
        return (
          <Chip
            label={intl.formatMessage({
              id: params.value ? 'accounts.status.admin' : 'accounts.status.user',
            })}
            color={params.value ? 'primary' : 'default'}
            size='small'
            variant={params.value ? 'filled' : 'outlined'}
          />
        );
      },
    },
    {
      field: 'name',
      headerName: intl.formatMessage({ id: 'accounts.columns.name' }),
      flex: 1,
      minWidth: 150,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'first_name',
      headerName: intl.formatMessage({ id: 'accounts.columns.first_name' }),
      flex: 1,
      minWidth: 150,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'email',
      headerName: intl.formatMessage({ id: 'accounts.columns.email' }),
      flex: 1.5,
      minWidth: 200,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'phone',
      headerName: intl.formatMessage({ id: 'accounts.columns.phone' }),
      flex: 1,
      minWidth: 120,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'address',
      headerName: intl.formatMessage({ id: 'accounts.columns.address' }),
      flex: 1,
      minWidth: 120,
      type: 'string',
      sortable: true,
      filterable: false,
    },
    {
      field: 'created_at',
      headerName: intl.formatMessage({ id: 'accounts.columns.createdAt' }),
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
      headerName: intl.formatMessage({ id: 'accounts.columns.actions' }),
      width: 150,
      sortable: false,
      filterable: false,
      getActions: (params: any) => {
        const actions = [
          <GridActionsCellItem
            icon={<ViewIcon />}
            label={intl.formatMessage({ id: 'accounts.actions.view' })}
            onClick={() => navigate(`/accounts/${params.id}`)}
          />,
        ];

        // Ajouter l'action "Passer en admin" si possible
        if (authUser && canMakeAdmin(params.row, authUser)) {
          actions.push(
            <GridActionsCellItem
              icon={<PersonAddIcon />}
              label={intl.formatMessage({ id: 'accounts.actions.makeAdmin' })}
              onClick={() => handleMakeAdmin(params.id as number)}
            />
          );
        }

        // Ajouter l'action "Supprimer" si possible
        if (authUser && canDeleteAccount(params.row, authUser)) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon color='error' />}
              label={intl.formatMessage({ id: 'accounts.actions.delete' })}
              onClick={() => handleDelete(params.id as number)}
            />
          );
        }

        return actions;
      },
    },
  ];

  // Afficher le loader lors du chargement initial
  if (loading && accounts.length === 0) {
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
          {intl.formatMessage({ id: 'accounts.title' })}
        </Typography>
      </Box>

      {/* Barre de recherche */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '10px' }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant='outlined'
            placeholder={intl.formatMessage({ id: 'accounts.search.placeholder' })}
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
          rows={accounts}
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
        title={intl.formatMessage({ id: 'accounts.delete.title' })}
        message={
          <Box>
            <Typography variant='body1' sx={{ mb: 2 }}>
              {intl.formatMessage(
                { id: 'accounts.delete.message' },
                { name: accountToDelete ? getAccountFullName(accountToDelete) : '' }
              )}
            </Typography>
            <Typography
              variant='body2'
              sx={{
                color: 'error.main',
                fontWeight: 'bold',
                backgroundColor: 'error.light',
                p: 2,
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'error.main',
              }}
            >
              {intl.formatMessage({ id: 'accounts.delete.warning' })}
            </Typography>
          </Box>
        }
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={intl.formatMessage({ id: 'accounts.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />

      {/* Modal de confirmation pour passer en admin */}
      <ConfirmationModal
        open={makeAdminModalOpen}
        title={intl.formatMessage({ id: 'accounts.makeAdmin.title' })}
        message={intl.formatMessage(
          { id: 'accounts.makeAdmin.message' },
          { name: accountToMakeAdmin ? getAccountFullName(accountToMakeAdmin) : '' }
        )}
        onConfirm={handleConfirmMakeAdmin}
        onCancel={handleCancelMakeAdmin}
        confirmText={intl.formatMessage({ id: 'accounts.actions.makeAdmin' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default AccountsList;
