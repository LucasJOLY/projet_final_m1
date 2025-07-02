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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchProject, deleteProjectAction } from './store/slice';
import { getProjectStatusColor, PROJECT_STATUS_OPTIONS } from './utils';
import { getClientFullDisplayName, getClientTypeIcon, getClientTypeLabel } from '../clients/utils';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import ConfirmationModal from '../components/ConfirmationModal';
import { CopyButtonIcon } from '../utils/utils';
import QuotesList from '../quotes/QuotesList';
import InvoiceList from '../invoices/InvoiceList';
import BackButton from '../components/BackButton';

const ProjectView: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const locale = localStorage.getItem('language') || 'fr';

  const { currentProject, loading } = useSelector((state: RootState) => state.projects);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchProject(parseInt(id)));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (currentProject) {
      try {
        await dispatch(deleteProjectAction(currentProject.id)).unwrap();
        navigate('/projects');
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

  if (!currentProject) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{intl.formatMessage({ id: 'projects.notFound' })}</Typography>
      </Box>
    );
  }

  const { color, backgroundColor } = getProjectStatusColor(currentProject.status);

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr auto' },
          gap: { xs: 2, sm: 2 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}
      >
        <BackButton />

        <Typography
          variant='h4'
          component='h1'
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            justifySelf: { xs: 'start', sm: 'start' },
          }}
        >
          {intl.formatMessage({ id: 'projects.view.title' })}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'wrap',
            justifySelf: { xs: 'start', sm: 'end' },
          }}
        >
          <PrimaryButton
            variant='contained'
            startIcon={<EditIcon />}
            onClick={() => navigate(`/projects/${currentProject.id}/edit`)}
          >
            {intl.formatMessage({ id: 'projects.view.edit' })}
          </PrimaryButton>
          <PrimaryButton
            variant='outlined'
            color='error'
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteDialogOpen(true)}
            sx={{ backgroundColor: 'error.main', '&:hover': { backgroundColor: 'error.dark' } }}
          >
            {intl.formatMessage({ id: 'projects.view.delete' })}
          </PrimaryButton>
        </Box>
      </Box>

      {/* Informations du projet */}
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
          {currentProject.name}
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
          {/* Informations de base */}
          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'projects.view.basicInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'projects.view.name' })}
                </Typography>
                <Typography variant='body1'>{currentProject.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'projects.view.status' })}
                </Typography>
                <Chip
                  label={intl.formatMessage({
                    id: PROJECT_STATUS_OPTIONS.find(
                      (option) => option.value === currentProject.status
                    )?.label,
                  })}
                  size='small'
                  sx={{
                    color,
                    backgroundColor,
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    mt: 1,
                  }}
                />
              </Box>
            </CardContent>
          </Card>

          {/* Informations client */}
          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'projects.view.client' })}
              </Typography>
              {currentProject.client ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {intl.formatMessage({ id: 'clients.view.type' })}
                    </Typography>
                    <Typography variant='body1'>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getClientTypeIcon(currentProject.client)}
                        {intl.formatMessage({
                          id: getClientTypeLabel(currentProject.client.is_company),
                        })}
                      </Box>
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {intl.formatMessage({ id: 'clients.view.contactInfo' })}
                    </Typography>
                    <Typography variant='body1'>
                      {getClientFullDisplayName(currentProject.client)}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {intl.formatMessage({ id: 'clients.view.contactName' })}
                    </Typography>
                    <Typography variant='body1'>
                      {currentProject.client.contact_name}{' '}
                      {currentProject.client.contact_first_name || ''}
                    </Typography>
                  </Box>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {intl.formatMessage({ id: 'clients.view.email' })}
                    </Typography>
                    <Typography variant='body1'>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {currentProject.client.email}
                        <CopyButtonIcon text={currentProject.client.email} />
                      </Box>
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant='subtitle2' color='textSecondary'>
                      {intl.formatMessage({ id: 'clients.view.phone' })}
                    </Typography>
                    <Typography variant='body1'>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {currentProject.client.phone}
                        <CopyButtonIcon text={currentProject.client.phone} />
                      </Box>
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant='body2' color='textSecondary'>
                  Aucune information client disponible
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Informations système */}
        <Card variant='outlined' sx={{ borderRadius: '10px' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              {intl.formatMessage({ id: 'projects.view.systemInfo' })}
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
                  {intl.formatMessage({ id: 'projects.view.createdAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentProject.created_at).toLocaleDateString(
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
                  {intl.formatMessage({ id: 'projects.view.updatedAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentProject.updated_at).toLocaleDateString(
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

      {/* Liste des devis du projet */}
      <Box sx={{ mt: 4 }}>
        <QuotesList
          projectId={currentProject.id}
          clientId={currentProject.client_id}
          showProjectColumn={false}
          title={intl.formatMessage({ id: 'quotes.project.title' })}
          showAddButton={true}
        />
      </Box>

      {/* Liste des factures du projet */}
      <Box sx={{ mt: 4 }}>
        <InvoiceList
          projectId={currentProject.id}
          clientId={currentProject.client_id}
          showProjectColumn={false}
          showClientColumn={false}
          title={intl.formatMessage({ id: 'invoices.project.title' })}
          showAddButton={true}
        />
      </Box>

      {/* Modal de confirmation de suppression */}
      <ConfirmationModal
        open={deleteDialogOpen}
        title={intl.formatMessage({ id: 'projects.delete.title' })}
        message={intl.formatMessage(
          { id: 'projects.delete.message' },
          { name: currentProject.name }
        )}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={intl.formatMessage({ id: 'projects.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default ProjectView;
