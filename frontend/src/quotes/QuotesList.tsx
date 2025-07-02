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
import { fetchProjectQuotes, fetchClientQuotes, deleteQuoteAction } from './store/slice';
import type { Quote, QuoteStatus } from './types';
import {
  formatQuoteNumber,
  formatPrice,
  calculateQuoteTotal,
  getQuoteStatusColor,
  getQuoteStatusLabel,
  canDeleteQuote,
  canEditQuote,
  getQuoteTotal,
  QUOTE_STATUS_OPTIONS,
} from './utils';
import { GRID_DEFAULT_LOCALE_TEXT_FR } from '../utils/DataGridLocaleFR';
import { GRID_DEFAULT_LOCALE_TEXT_EN } from '../utils/DataGridLocaleEN';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';

interface QuotesListProps {
  projectId?: number;
  clientId?: number;
  showProjectColumn?: boolean;
  title?: string;
  showAddButton?: boolean;
}

const QuotesList: React.FC<QuotesListProps> = ({
  projectId,
  clientId,
  showProjectColumn = true,
  title,
  showAddButton = false,
}) => {
  const isDarkMode = useTheme().palette.mode === 'dark';
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const locale = localStorage.getItem('language') || 'fr';

  const { quotes, loading, pagination } = useSelector((state: RootState) => state.quotes);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<QuoteStatus[]>([0, 1, 2]);
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 25,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: 'quote_number', sort: 'desc' },
  ]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  // Recharger les devis quand les filtres changent
  useEffect(() => {
    loadQuotes();
  }, [sortModel, paginationModel, selectedStatuses, projectId, clientId]);

  // Charger les devis
  const loadQuotes = () => {
    const filters = {
      status: selectedStatuses,
      search_term: searchTerm.trim() || undefined,
      sort_by: sortModel[0]?.field || undefined,
      sort_order: (sortModel[0]?.sort as 'asc' | 'desc') || undefined,
      per_page: paginationModel.pageSize,
      page: paginationModel.page + 1,
    };
    if (projectId) {
      dispatch(fetchProjectQuotes({ projectId, filters }));
    } else if (clientId) {
      dispatch(fetchClientQuotes({ clientId, filters }));
    }
  };

  // Gérer la recherche
  const handleSearch = () => {
    setPaginationModel({ page: 0, pageSize: 25 });
    loadQuotes();
  };

  // Gérer la suppression d'un devis
  const handleDelete = async (id: number) => {
    const quote = quotes.find((q: Quote) => q.id === id);
    setQuoteToDelete(quote || null);
    setDeleteModalOpen(true);
  };

  // Confirmer la suppression
  const handleConfirmDelete = async () => {
    if (quoteToDelete) {
      try {
        await dispatch(deleteQuoteAction(quoteToDelete.id)).unwrap();
        loadQuotes(); // Recharger la liste
        setDeleteModalOpen(false);
        setQuoteToDelete(null);
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
  };

  // Annuler la suppression
  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setQuoteToDelete(null);
  };

  // Réinitialiser les filtres
  const handleResetFilters = () => {
    setSelectedStatuses([0, 1, 2]);
    setSearchTerm('');
    setPaginationModel({ page: 0, pageSize: 25 });
  };

  // Ajouter un devis
  const handleAddQuote = () => {
    if (projectId) {
      navigate(`/quotes/add/${clientId || 0}?project_id=${projectId}`);
    } else {
      navigate(`/quotes/add/${clientId || 0}`);
    }
  };

  // Filtrer les devis selon les critères
  const filteredQuotes = quotes.filter((quote: Quote) => {
    // Filtre par statut
    if (!selectedStatuses.includes(quote.status)) return false;

    return true;
  });

  // Colonnes du DataGrid
  const columns: GridColDef<Quote>[] = [
    {
      field: 'quote_number',
      headerName: intl.formatMessage({ id: 'quotes.columns.number' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      valueFormatter: (params: any) => formatQuoteNumber(params),
    },
    ...(showProjectColumn
      ? [
          {
            field: 'project',
            headerName: intl.formatMessage({ id: 'quotes.columns.project' }),
            flex: 1,
            minWidth: 200,
            sortable: true,
            filterable: false,
            valueGetter: (params: any) => params.row.project?.name || '',
          },
        ]
      : []),
    {
      field: 'status',
      headerName: intl.formatMessage({ id: 'quotes.columns.status' }),
      flex: 0.8,
      minWidth: 120,
      sortable: true,
      filterable: false,
      renderCell: (params: any) => {
        const { color, backgroundColor } = getQuoteStatusColor(params.value);
        return (
          <Chip
            label={intl.formatMessage({ id: getQuoteStatusLabel(params.value) })}
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
      field: 'issue_date',
      headerName: intl.formatMessage({ id: 'quotes.columns.issueDate' }),
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
      field: 'expiry_date',
      headerName: intl.formatMessage({ id: 'quotes.columns.expiryDate' }),
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
      headerName: intl.formatMessage({ id: 'quotes.columns.total' }),
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
      headerName: intl.formatMessage({ id: 'quotes.columns.actions' }),
      width: 120,
      sortable: false,
      filterable: false,
      getActions: (params: any) => {
        const quote = params.row as Quote;
        const canEdit = canEditQuote(quote.status);
        const canDelete = canDeleteQuote(quote.status);

        const actions = [
          <GridActionsCellItem
            icon={<VisibilityIcon />}
            label={intl.formatMessage({ id: 'quotes.actions.view' })}
            onClick={() => navigate(`/quotes/${params.id}`)}
          />,
        ];

        if (canEdit) {
          actions.push(
            <GridActionsCellItem
              icon={<EditIcon />}
              label={intl.formatMessage({ id: 'quotes.actions.edit' })}
              onClick={() => navigate(`/quotes/${params.id}/edit`)}
            />
          );
        }

        if (canDelete) {
          actions.push(
            <GridActionsCellItem
              icon={<DeleteIcon color='error' />}
              label={intl.formatMessage({ id: 'quotes.actions.delete' })}
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
              {filteredQuotes.length > 0 && (
                <Typography
                  component='span'
                  variant='body2'
                  sx={{ ml: 1, color: 'text.secondary' }}
                >
                  ({filteredQuotes.length})
                </Typography>
              )}
            </Typography>
          )}
          {showAddButton && (
            <PrimaryButton startIcon={<AddIcon />} onClick={handleAddQuote}>
              {intl.formatMessage({ id: 'quotes.add' })}
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
              md: '2fr 1fr auto',
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
            placeholder={
              intl.formatMessage({ id: 'quotes.search.placeholder' }) ||
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
            <InputLabel>{intl.formatMessage({ id: 'quotes.filters.status' })}</InputLabel>
            <Select
              multiple
              value={selectedStatuses}
              onChange={(e) => setSelectedStatuses(e.target.value as QuoteStatus[])}
              input={<OutlinedInput label={intl.formatMessage({ id: 'quotes.filters.status' })} />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={intl.formatMessage({
                        id: QUOTE_STATUS_OPTIONS.find((option) => option.value === value)?.label,
                      })}
                      size='small'
                    />
                  ))}
                </Box>
              )}
            >
              {QUOTE_STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {intl.formatMessage({ id: option.label })}
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
      <Paper sx={{ height: 400, width: '100%', borderRadius: '10px' }}>
        {loading && filteredQuotes.length === 0 ? (
          <Box display='flex' justifyContent='center' alignItems='center' height='100%'>
            <CircularProgress />
          </Box>
        ) : (
          <DataGrid
            rows={filteredQuotes}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[25]}
            rowCount={filteredQuotes.length}
            sortingMode='client'
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
        title={intl.formatMessage({ id: 'quotes.delete.title' })}
        message={intl.formatMessage(
          { id: 'quotes.delete.message' },
          { number: quoteToDelete ? formatQuoteNumber(quoteToDelete.quote_number) : '' }
        )}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmText={intl.formatMessage({ id: 'quotes.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default QuotesList;
