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
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchInvoice, deleteInvoiceAction } from './store/slice';
import {
  formatInvoiceNumber,
  formatPrice,
  getInvoiceStatusColor,
  getInvoiceStatusLabel,
  getInvoiceTotal,
  getPaymentTypeLabel,
} from './utils';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';
import BackButton from '../components/BackButton';
import { generateInvoicePDF } from './InvoicePDFGenerator';

const InvoiceView: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const locale = localStorage.getItem('language') || 'fr';

  const { currentInvoice, loading } = useSelector((state: RootState) => state.invoices);
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchInvoice(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (currentInvoice) {
      try {
        await dispatch(deleteInvoiceAction(currentInvoice.id)).unwrap();
        navigate('/invoices');
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
    setDeleteDialogOpen(false);
  };

  const canEdit = currentInvoice?.status !== 3; // 3 = payée
  const canDelete = currentInvoice?.status !== 3; // 3 = payée

  const calculateTotal = () => {
    return currentInvoice ? getInvoiceTotal(currentInvoice) : 0;
  };

  const handleGeneratePDF = async () => {
    if (!currentInvoice || !authUser) return;

    try {
      const companyData = {
        name: `${authUser.first_name} ${authUser.name}`,
        address: authUser.address,
        phone: authUser.phone,
        email: authUser.email,
      };

      await generateInvoicePDF(currentInvoice, companyData, intl);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      // Afficher une notification d'erreur si nécessaire
    }
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

  if (!currentInvoice) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{intl.formatMessage({ id: 'invoices.notFound' })}</Typography>
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
            {intl.formatMessage({ id: 'invoices.view.title' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <PrimaryButton
            variant='contained'
            startIcon={<VisibilityIcon />}
            onClick={handleGeneratePDF}
            sx={{ backgroundColor: 'success.main', '&:hover': { backgroundColor: 'success.dark' } }}
          >
            {intl.formatMessage({ id: 'invoices.view.viewPDF' })}
          </PrimaryButton>
          {canEdit && (
            <PrimaryButton
              variant='contained'
              startIcon={<EditIcon />}
              onClick={() => navigate(`/invoices/${currentInvoice.id}/edit`)}
            >
              {intl.formatMessage({ id: 'invoices.view.edit' })}
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
              {intl.formatMessage({ id: 'invoices.view.delete' })}
            </PrimaryButton>
          )}
        </Box>
      </Box>

      {/* Informations de la facture */}
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
            {formatInvoiceNumber(currentInvoice.invoice_number)}
          </Typography>
          <Chip
            label={intl.formatMessage({ id: getInvoiceStatusLabel(currentInvoice.status) })}
            sx={{
              ...getInvoiceStatusColor(currentInvoice.status),
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
                {intl.formatMessage({ id: 'invoices.view.basicInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'invoices.view.project' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentInvoice.project?.name ||
                      intl.formatMessage({ id: 'invoices.view.noProject' })}
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'invoices.view.client' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentInvoice.project?.client?.name ||
                      intl.formatMessage({ id: 'invoices.view.noClient' })}
                  </Box>
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'invoices.view.status' })}
                </Typography>
                <Typography variant='body1'>
                  {intl.formatMessage({ id: getInvoiceStatusLabel(currentInvoice.status) })}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'invoices.view.dateInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'invoices.view.issueDate' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentInvoice.issue_date).toLocaleDateString(
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
                  {intl.formatMessage({ id: 'invoices.view.dueDate' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentInvoice.payment_due_date).toLocaleDateString(
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

        {/* Informations de paiement */}
        <Card variant='outlined' sx={{ borderRadius: '10px', mb: 3 }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              {intl.formatMessage({ id: 'invoices.view.paymentInfo' })}
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
                  {intl.formatMessage({ id: 'invoices.view.paymentType' })}
                </Typography>
                <Typography variant='body1'>
                  {intl.formatMessage({ id: getPaymentTypeLabel(currentInvoice.payment_type) })}
                </Typography>
              </Box>
              {currentInvoice.actual_payment_date && (
                <Box>
                  <Typography variant='subtitle2' color='textSecondary'>
                    {intl.formatMessage({ id: 'invoices.view.actualPaymentDate' })}
                  </Typography>
                  <Typography variant='body1'>
                    {new Date(currentInvoice.actual_payment_date).toLocaleDateString(
                      locale === 'fr' ? 'fr-FR' : 'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </Typography>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Note si présente */}
        {currentInvoice.footer_note && (
          <>
            <Divider sx={{ my: 3 }} />
            <Card variant='outlined' sx={{ borderRadius: '10px' }}>
              <CardContent>
                <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                  {intl.formatMessage({ id: 'invoices.view.note' })}
                </Typography>
                <Typography variant='body1' sx={{ whiteSpace: 'pre-wrap' }}>
                  {currentInvoice.footer_note}
                </Typography>
              </CardContent>
            </Card>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* Lignes de la facture */}
        <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
          {intl.formatMessage({ id: 'invoices.view.lines' })}
        </Typography>

        <TableContainer component={Paper} variant='outlined' sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>
                  {intl.formatMessage({ id: 'invoices.view.description' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {intl.formatMessage({ id: 'invoices.view.unitPrice' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'center' }}>
                  {intl.formatMessage({ id: 'invoices.view.quantity' })}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, textAlign: 'right' }}>
                  {intl.formatMessage({ id: 'invoices.view.total' })}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentInvoice.invoice_lines &&
                currentInvoice.invoice_lines.map((line, index) => (
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
                  {intl.formatMessage({ id: 'invoices.view.totalAmount' })}:
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
              {intl.formatMessage({ id: 'invoices.view.systemInfo' })}
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
                  {intl.formatMessage({ id: 'invoices.view.createdAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentInvoice.created_at).toLocaleDateString(
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
                  {intl.formatMessage({ id: 'invoices.view.updatedAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentInvoice.updated_at).toLocaleDateString(
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
        title={intl.formatMessage({ id: 'invoices.delete.title' })}
        message={intl.formatMessage(
          { id: 'invoices.delete.message' },
          { number: formatInvoiceNumber(currentInvoice.invoice_number) }
        )}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={intl.formatMessage({ id: 'invoices.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default InvoiceView;
