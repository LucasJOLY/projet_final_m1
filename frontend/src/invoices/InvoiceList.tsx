import React, { useEffect, useState } from 'react';
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
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import {
  fetchProjectInvoices,
  fetchClientInvoices,
  deleteInvoiceAction,
  fetchInvoices,
} from './store/slice';
import type { Invoice, InvoiceStatus } from './types';
import {
  formatInvoiceNumber,
  formatPrice,
  getInvoiceTotal,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
  canDeleteInvoice,
  canEditInvoice,
  isInvoiceOverdue,
  INVOICE_STATUS_OPTIONS,
} from './utils';
import { GRID_DEFAULT_LOCALE_TEXT_FR } from '../utils/DataGridLocaleFR';
import { GRID_DEFAULT_LOCALE_TEXT_EN } from '../utils/DataGridLocaleEN';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';
import CustomCheckbox from '../components/CustomCheckbox';

interface InvoiceListProps {
  projectId?: number;
  clientId?: number;
  showProjectColumn?: boolean;
  showClientColumn?: boolean;
  title?: string;
  showAddButton?: boolean;
}

const InvoiceList: React.FC<InvoiceListProps> = ({
  projectId,
  clientId,
  showProjectColumn = true,
  showClientColumn = true,
  title,
  showAddButton = false,
}) => {
  console.log('showAddButton', showAddButton);
  const isDarkMode = useTheme().palette.mode === 'dark';
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const locale = localStorage.getItem('language') || 'fr';

  const { invoices, loading, pagination } = useSelector((state: RootState) => state.invoices);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<InvoiceStatus[]>([0, 1, 2, 3]);
  const [showOverdueOnly, setShowOverdueOnly] = useState(false);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'invoice_number', sort: 'desc' },
  ]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Recharger les factures quand les filtres changent
  useEffect(() => {
    loadInvoices();
  }, [sortModel, paginationModel, selectedStatuses, showOverdueOnly, projectId, clientId]);

  // Charger les factures
  const loadInvoices = () => {
    const filters = {
      status: selectedStatuses,
      overdue_only: showOverdueOnly,
      search_term: searchTerm.trim() || undefined,
      sort_by: sortModel[0]?.field || undefined,
      sort_order: (sortModel[0]?.sort as 'asc' | 'desc') || undefined,
      per_page: paginationModel.pageSize,
      page: paginationModel.page + 1,
    };

    if (projectId) {
      dispatch(fetchProjectInvoices({ projectId, filters }));
    } else if (clientId) {
      dispatch(fetchClientInvoices({ clientId, filters }));
    } else {
      dispatch(fetchInvoices({ filters }));
    }
  };

  // Gérer la recherche
  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: 25 });
    loadInvoices();
  };

  // Gérer la suppression d'une facture
  const handleDelete = async (id: number) => {
    const invoice = invoices.find((i: Invoice) => i.id === id);
    setInvoiceToDelete(invoice || null);
    setDeleteModalOpen(true);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (invoiceToDelete) {
      try {
        await dispatch(deleteInvoiceAction(invoiceToDelete.id)).unwrap();
        loadInvoices(); // Recharger la liste
        setDeleteModalOpen(false);
        setInvoiceToDelete(null);
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setInvoiceToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedStatuses([0, 1, 2, 3, 4]);
    setShowOverdueOnly(false);
    setSearchTerm('');
    setPaginationModel({ page: 0, pageSize: 25 });
  };

  // Ajouter une facture
  const handleAddInvoice = () => {
    if (projectId) {
      navigate(`/invoices/add/${clientId || 0}?project_id=${projectId}`);
    } else {
      navigate(`/invoices/add/${clientId || 0}`);
    }
  };

  // Colonnes du DataGrid
  const columns: GridColDef<Invoice>[] = [
    {
      field: 'invoice_number',
      headerName: intl.formatMessage({ id: 'invoices.columns.number' }),
      flex: 0.8,
      minWidth: 120,
      valueFormatter: (params: any) => formatInvoiceNumber(params),
      sortable: true,
      filterable: false,
    },
    ...(showProjectColumn
      ? [
          {
            field: 'project_name',
            headerName: intl.formatMessage({ id: 'invoices.columns.project' }),
            flex: 1,
            minWidth: 200,
            sortable: true,
            filterable: false,
            renderCell: (params: any) => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                  <Typography variant='body2'>
                    {params.row.project?.name || intl.formatMessage({ id: 'invoices.noProject' })}
                  </Typography>
                </Box>
              );
            },
          },
        ]
      : []),
    ...(showClientColumn
      ? [
          {
            field: 'client_name',
            headerName: intl.formatMessage({ id: 'invoices.columns.client' }),
            flex: 1,
            minWidth: 200,
            sortable: true,
            filterable: false,
            renderCell: (params: any) => {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
                  <Typography variant='body2'>
                    {params.row.project?.client?.name ||
                      intl.formatMessage({ id: 'invoices.noClient' })}
                  </Typography>
                </Box>
              );
            },
          },
        ]
      : []),
    {
      field: 'status',
      headerName: intl.formatMessage({ id: 'invoices.columns.status' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      renderCell: (params: any) => {
        const { color, backgroundColor } = getInvoiceStatusColor(params.value);
        const isOverdue = isInvoiceOverdue(params.row);

        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, height: '100%' }}>
            <Chip
              label={intl.formatMessage({ id: getInvoiceStatusLabel(params.value) })}
              size='small'
              sx={{
                color: isOverdue ? '#d32f2f' : color,
                backgroundColor: isOverdue ? '#ffebee' : backgroundColor,
                fontWeight: 'bold',
                fontSize: '0.75rem',
              }}
            />
            {isOverdue && (
              <Chip
                label='EN RETARD'
                size='small'
                sx={{
                  color: '#d32f2f',
                  backgroundColor: '#ffcdd2',
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: 'issue_date',
      headerName: intl.formatMessage({ id: 'invoices.columns.issueDate' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
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
      field: 'payment_due_date',
      headerName: intl.formatMessage({ id: 'invoices.columns.dueDate' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
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
      field: 'total',
      headerName: intl.formatMessage({ id: 'invoices.columns.total' }),
      flex: 0.8,
      minWidth: 120,
      align: 'right',
      headerAlign: 'right',
      sortable: true,
      filterable: false,
      valueFormatter: (params: any) => formatPrice(params),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: intl.formatMessage({ id: 'invoices.columns.actions' }),
      width: 120,
      sortable: false,
      filterable: false,
      getActions: (params: any) => {
        const invoice = params.row as Invoice;
        const canEdit = canEditInvoice(invoice.status);
        const canDelete = canDeleteInvoice(invoice.status);

        const actions = [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label={intl.formatMessage({ id: 'invoices.actions.view' })}
            onClick={() => navigate(`/invoices/${params.id}`)}
          />,
        ];

        if (canEdit) {
          actions.push(
            <GridActionsCellItem
              icon={<EditIcon />}
              label={intl.formatMessage({ id: 'invoices.actions.edit' })}
              onClick={() => navigate(`/invoices/${params.id}/edit`)}
            />
          );
        }

        if (canDelete) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon color='error' />}
              label={intl.formatMessage({ id: 'invoices.actions.delete' })}
              onClick={() => handleDelete(params.id as number)}
            />
          );
        }

        return actions;
      },
    },
  ];

  return (
    <Box>
      {/* En-tête */}
      {(title || showAddButton) && (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
            gap: { xs: 2, sm: 0 },
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 3,
          }}
        >
          {title && (
            <Typography
              variant='h5'
              component='h2'
              sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
            >
              {title}
              {pagination.total > 0 && (
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  ({pagination.total})
                </Typography>
              )}
            </Typography>
          )}
          {showAddButton && (
            <PrimaryButton startIcon={<AddIcon />} onClick={handleAddInvoice}>
              {intl.formatMessage({ id: 'invoices.add' })}
            </PrimaryButton>
          )}
        </Box>
      )}

      {/* Barre de filtres et recherche */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '10px' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr auto auto',
            },
            gap: 1,
            alignItems: 'flex-end',
          }}
        >
          {/* Recherche */}
          <TextField
            fullWidth
            variant='outlined'
            label={intl.formatMessage({ id: 'projects.search.label' })}
            placeholder={
              intl.formatMessage({ id: 'invoices.search.placeholder' }) ||
              'Rechercher par numéro, projet, note...'
            }
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

          {/* Filtre par statut */}
          <FormControl fullWidth>
            <InputLabel>{intl.formatMessage({ id: 'invoices.filters.status' })}</InputLabel>
            <Select
              multiple
              value={selectedStatuses}
              onChange={(e) => setSelectedStatuses(e.target.value as InvoiceStatus[])}
              input={
                <OutlinedInput label={intl.formatMessage({ id: 'invoices.filters.status' })} />
              }
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={intl.formatMessage({
                        id: INVOICE_STATUS_OPTIONS.find((option) => option.value === value)?.label,
                      })}
                      size='small'
                    />
                  ))}
                </Box>
              )}
            >
              {INVOICE_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {intl.formatMessage({ id: option.label })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              height: '58px',
              borderRadius: '8px',
              backgroundColor: isDarkMode ? '#1b2431' : '#f5f5f5',
              padding: '0 10px',
            }}
          >
            <CustomCheckbox
              checked={showOverdueOnly}
              onChange={setShowOverdueOnly}
              label={intl.formatMessage({ id: 'invoices.filters.overdue' })}
            />
          </Box>

          {/* Checkbox pour les factures en retard */}

          {/* Bouton de réinitialisation */}
          <PrimaryButton variant='outlined' startIcon={<FilterIcon />} onClick={handleResetFilters}>
            {intl.formatMessage({ id: 'projects.filters.reset' })}
          </PrimaryButton>
        </Box>
      </Paper>

      {/* DataGrid */}
      <Paper sx={{ height: 400, width: '100%', borderRadius: '10px' }}>
        {loading && invoices.length === 0 ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={invoices}
            columns={columns}
            pagination
            paginationMode='server'
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25]}
            rowCount={pagination.total}
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
        )}
      </Paper>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        open={deleteModalOpen}
        title={intl.formatMessage({ id: 'invoices.delete.title' })}
        message={intl.formatMessage(
          { id: 'invoices.delete.message' },
          { number: invoiceToDelete ? formatInvoiceNumber(invoiceToDelete.invoice_number) : '' }
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={intl.formatMessage({ id: 'invoices.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default InvoiceList;
