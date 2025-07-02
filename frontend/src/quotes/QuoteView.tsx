import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Divider,
  useTheme,
  CircularProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchQuote, deleteQuoteAction } from './store/slice';
import {
  formatQuoteNumber,
  formatPrice,
  getQuoteStatusColor,
  getQuoteStatusLabel,
  getQuoteTotal,
} from './utils';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ConfirmationModal from '../components/ConfirmationModal';
import BackButton from '../components/BackButton';

const QuoteView: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const locale = localStorage.getItem('language') || 'fr';

  const { currentQuote, loading } = useSelector((state: RootState) => state.quotes);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchQuote(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (currentQuote) {
      try {
        await dispatch(deleteQuoteAction(currentQuote.id)).unwrap();
        navigate('/quotes');
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleConvertToInvoice = () => {
    if (currentQuote) {
      const clientId = currentQuote.project?.client_id;
      // Naviguer vers la page de création de facture avec les données du devis
      navigate(
        `/invoices/add/${clientId}?from_quote=${currentQuote.id}&project_id=${currentQuote.project_id}`
      );
    }
  };

  const canEdit = currentQuote?.status !== 1; // 1 = accepté
  const canDelete = currentQuote?.status !== 1; // 1 = accepté
  const canConvertToInvoice = currentQuote?.status === 1; // Seulement les devis acceptés

  const calculateTotal = () => {
    return currentQuote ? getQuoteTotal(currentQuote) : 0;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  if (!currentQuote) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{intl.formatMessage({ id: 'quotes.notFound' })}</Typography>
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
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 2 },
          }}
        >
          <BackButton />
          <Typography
            variant='h4'
            component='h1'
            sx={{
              fontWeight: 'bold',
              color: theme.palette.primary.main,
            }}
          >
            {intl.formatMessage({ id: 'quotes.view.title' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {canEdit && (
            <PrimaryButton
              variant='contained'
              startIcon={<EditIcon />}
              onClick={() => navigate(`/quotes/${currentQuote.id}/edit`)}
            >
              {intl.formatMessage({ id: 'quotes.view.edit' })}
            </PrimaryButton>
          )}
          {canConvertToInvoice && (
            <PrimaryButton
              variant='contained'
              startIcon={<ReceiptIcon />}
              onClick={handleConvertToInvoice}
              sx={{
                backgroundColor: 'success.main',
                '&:hover': { backgroundColor: 'success.dark' },
              }}
            >
              {intl.formatMessage({ id: 'quotes.view.convertToInvoice' })}
            </PrimaryButton>
          )}
          {canDelete && (
            <PrimaryButton
              variant='outlined'
              color='error'
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ backgroundColor: 'error.main', '&:hover': { backgroundColor: 'error.dark' } }}
            >
              {intl.formatMessage({ id: 'quotes.view.delete' })}
            </PrimaryButton>
          )}
        </Box>
      </Box>

      {/* Informations du devis */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: '20px', sm: '40px' },
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography variant='h5' sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            {formatQuoteNumber(currentQuote.quote_number)}
          </Typography>
          <Chip
            label={intl.formatMessage({ id: getQuoteStatusLabel(currentQuote.status) })}
            sx={{
              backgroundColor: getQuoteStatusColor(currentQuote.status),
              color: 'black',
              fontWeight: 600,
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              md: '1fr 1fr',
            },
            gap: 3,
            mb: 3,
          }}
        >
          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'quotes.view.basicInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.project' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentQuote.project?.name ||
                      intl.formatMessage({ id: 'quotes.view.noProject' })}
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.client' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentQuote.project?.client?.name ||
                      intl.formatMessage({ id: 'quotes.view.noClient' })}
                  </Box>
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.status' })}
                </Typography>
                <Typography variant='body1'>
                  {intl.formatMessage({ id: getQuoteStatusLabel(currentQuote.status) })}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'quotes.view.dateInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.issueDate' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentQuote.issue_date).toLocaleDateString(
                    locale === 'fr' ? 'fr-FR' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.expiryDate' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentQuote.expiry_date).toLocaleDateString(
                    locale === 'fr' ? 'fr-FR' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Note si présente */}
        {currentQuote.note && (
          <>
            <Divider sx={{ my: 3 }} />
            <Card variant='outlined' sx={{ borderRadius: '10px' }}>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                  {intl.formatMessage({ id: 'quotes.view.note' })}
                </Typography>
                <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
                  {currentQuote.note}
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Lignes du devis */}
        <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
          {intl.formatMessage({ id: 'quotes.view.lines' })}
        </Typography>

        <TableContainer component={Paper} variant='outlined' sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  {intl.formatMessage({ id: 'quotes.view.description' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {intl.formatMessage({ id: 'quotes.view.unitPrice' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  {intl.formatMessage({ id: 'quotes.view.quantity' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {intl.formatMessage({ id: 'quotes.view.total' })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentQuote.quote_lines &&
                currentQuote.quote_lines.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell>{line.description}</TableCell>
                    <TableCell sx={{ textAlign: 'right' }}>
                      {formatPrice(line.unit_price)}
                    </TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>{line.quantity}</TableCell>
                    <TableCell sx={{ textAlign: 'right', fontWeight: 600 }}>
                      {formatPrice(line.unit_price * line.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow>
                <TableCell
                  colSpan={3}
                  sx={{ textAlign: 'right', fontWeight: 600, fontSize: '1.1rem' }}
                >
                  {intl.formatMessage({ id: 'quotes.view.totalAmount' })}:
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'right',
                    fontWeight: 600,
                    fontSize: '1.2rem',
                    color: theme.palette.primary.main,
                  }}
                >
                  {formatPrice(calculateTotal())}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ my: 3 }} />

        {/* Informations système */}
        <Card variant='outlined' sx={{ borderRadius: '10px' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              {intl.formatMessage({ id: 'quotes.view.systemInfo' })}
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  md: '1fr 1fr',
                },
                gap: 2,
              }}
            >
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.createdAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentQuote.created_at).toLocaleDateString(
                    locale === 'fr' ? 'fr-FR' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'quotes.view.updatedAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentQuote.updated_at).toLocaleDateString(
                    locale === 'fr' ? 'fr-FR' : 'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    }
                  )}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Paper>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        open={deleteDialogOpen}
        title={intl.formatMessage({ id: 'quotes.delete.title' })}
        message={intl.formatMessage(
          { id: 'quotes.delete.message' },
          { number: formatQuoteNumber(currentQuote.quote_number) }
        )}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={intl.formatMessage({ id: 'quotes.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default QuoteView;
