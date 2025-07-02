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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchClient, deleteClientAction } from './store/slice';
import { getClientFullDisplayName, getClientTypeLabel } from './utils';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';
import ProjectsList from '../projects/ProjectsList';
import QuotesList from '../quotes/QuotesList';
import InvoiceList from '../invoices/InvoiceList';
import { CopyButtonIcon } from '../utils/utils';
import BackButton from '../components/BackButton';

const ClientView: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const locale = localStorage.getItem('language') || 'fr';

  const { currentClient, loading } = useSelector((state: RootState) => state.clients);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchClient(parseInt(id)));
    }
  }, [id]);

  const handleDelete = async () => {
    if (currentClient) {
      try {
        await dispatch(deleteClientAction(currentClient.id)).unwrap();
        navigate('/clients');
      } catch (error) {
        // L'erreur est déjà gérée dans le service
      }
    }
    setDeleteDialogOpen(false);
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

  if (!currentClient) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{intl.formatMessage({ id: 'clients.notFound' })}</Typography>
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
            {intl.formatMessage({ id: 'clients.view.title' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <PrimaryButton
            variant='contained'
            startIcon={<EditIcon />}
            onClick={() => navigate(`/clients/${currentClient.id}/edit`)}
          >
            {intl.formatMessage({ id: 'clients.view.edit' })}
          </PrimaryButton>
          <PrimaryButton
            variant='outlined'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ backgroundColor: 'error.main', '&:hover': { backgroundColor: 'error.dark' } }}
          >
            {intl.formatMessage({ id: 'clients.view.delete' })}
          </PrimaryButton>
        </Box>
      </Box>

      {/* Informations du client */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: '20px', sm: '40px' },
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        }}
      >
        <Typography variant='h5' sx={{ mb: 3, color: theme.palette.primary.main, fontWeight: 600 }}>
          {getClientFullDisplayName(currentClient)}
        </Typography>

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
                {intl.formatMessage({ id: 'clients.view.contactInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'clients.view.type' })}
                </Typography>
                <Typography variant='body1'>
                  {intl.formatMessage({ id: getClientTypeLabel(currentClient.is_company) })}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'clients.view.contactName' })}
                </Typography>
                <Typography variant='body1'>
                  {currentClient.is_company
                    ? `${currentClient.contact_first_name || ''} ${
                        currentClient.contact_name
                      }`.trim()
                    : `${currentClient.contact_first_name || ''} ${
                        currentClient.contact_name
                      }`.trim()}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'clients.view.email' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentClient.email}
                    <CopyButtonIcon text={currentClient.email} />
                  </Box>
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'clients.view.phone' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentClient.phone}
                    <CopyButtonIcon text={currentClient.phone} />
                  </Box>
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'clients.view.addressInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'clients.view.address' })}
                </Typography>
                <Typography variant='body1'>{currentClient.address}</Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'clients.view.city' })}
                </Typography>
                <Typography variant='body1'>{currentClient.city}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Informations système */}
        <Card variant='outlined' sx={{ borderRadius: '10px' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              {intl.formatMessage({ id: 'clients.view.systemInfo' })}
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
                  {intl.formatMessage({ id: 'clients.view.createdAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentClient.created_at).toLocaleDateString(
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
                  {intl.formatMessage({ id: 'clients.view.updatedAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentClient.updated_at).toLocaleDateString(
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

      {/* Liste des projets du client */}
      <Box sx={{ mt: 4 }}>
        <ProjectsList
          clientId={currentClient.id}
          showClientColumn={false}
          title={intl.formatMessage({ id: 'projects.client.title' })}
          showAddButton={true}
        />
      </Box>

      {/* Liste des devis du client */}
      <Box sx={{ mt: 4 }}>
        <QuotesList
          clientId={currentClient.id}
          showProjectColumn={true}
          title={intl.formatMessage({ id: 'quotes.client.title' })}
          showAddButton={true}
        />
      </Box>

      {/* Liste des factures du client */}
      <Box sx={{ mt: 4 }}>
        <InvoiceList
          clientId={currentClient.id}
          showProjectColumn={true}
          showClientColumn={false}
          title={intl.formatMessage({ id: 'invoices.client.title' })}
          showAddButton={true}
        />
      </Box>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        open={deleteDialogOpen}
        title={intl.formatMessage({ id: 'clients.delete.title' })}
        message={intl.formatMessage({ id: 'clients.delete.message' }, { name: currentClient.name })}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={intl.formatMessage({ id: 'clients.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default ClientView;
