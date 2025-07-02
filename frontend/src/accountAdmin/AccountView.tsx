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
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchAccount, deleteAccountAction } from './store/slice';
import { getAccountFullName, formatRevenue, formatExpenseRate, canDeleteAccount } from './utils';
import PrimaryButton from '../components/PrimaryButton';
import ConfirmationModal from '../components/ConfirmationModal';
import { CopyButtonIcon } from '../utils/utils';
import BackButton from '../components/BackButton';

const AccountView: React.FC = () => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams<{ id: string }>();
  const locale = localStorage.getItem('language') || 'fr';

  const { currentAccount = null, loading = false } = useSelector(
    (state: RootState) => state.accounts || {}
  );
  const authUser = useSelector((state: RootState) => state.auth.authUser);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchAccount(parseInt(id)));
    }
  }, [id]);

  const handleDelete = async () => {
    if (currentAccount) {
      try {
        await dispatch(deleteAccountAction(currentAccount.id)).unwrap();
        navigate('/admin/accounts');
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

  if (!currentAccount) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>{intl.formatMessage({ id: 'accounts.notFound' })}</Typography>
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
            {intl.formatMessage({ id: 'accounts.view.title' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {authUser && canDeleteAccount(currentAccount, authUser) && (
            <PrimaryButton
              variant='outlined'
              color='error'
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
              sx={{ backgroundColor: 'error.main', '&:hover': { backgroundColor: 'error.dark' } }}
            >
              {intl.formatMessage({ id: 'accounts.view.delete' })}
            </PrimaryButton>
          )}
        </Box>
      </Box>

      {/* Informations du compte */}
      <Paper
        elevation={3}
        sx={{
          padding: { xs: '20px', sm: '40px' },
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <Typography variant='h5' sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
            {getAccountFullName(currentAccount)}
          </Typography>
          <Chip
            label={intl.formatMessage({
              id: currentAccount.is_admin ? 'accounts.status.admin' : 'accounts.status.user',
            })}
            color={currentAccount.is_admin ? 'primary' : 'default'}
            variant={currentAccount.is_admin ? 'filled' : 'outlined'}
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
                {intl.formatMessage({ id: 'accounts.view.personalInfo' })}
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.name' })}
                </Typography>
                <Typography variant='body1'>{currentAccount.name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.firstName' })}
                </Typography>
                <Typography variant='body1'>{currentAccount.first_name}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.email' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentAccount.email}
                    <CopyButtonIcon text={currentAccount.email} />
                  </Box>
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.phone' })}
                </Typography>
                <Typography variant='body1'>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {currentAccount.phone}
                    <CopyButtonIcon text={currentAccount.phone} />
                  </Box>
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.birthDate' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentAccount.birth_date).toLocaleDateString(
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

          <Card variant='outlined' sx={{ borderRadius: '10px' }}>
            <CardContent>
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {intl.formatMessage({ id: 'accounts.view.addressInfo' })}
              </Typography>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.address' })}
                </Typography>
                <Typography variant='body1'>{currentAccount.address}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Informations financières */}
        <Card variant='outlined' sx={{ borderRadius: '10px', mb: 3 }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              {intl.formatMessage({ id: 'accounts.view.financialInfo' })}
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
                  {intl.formatMessage({ id: 'accounts.view.maxAnnualRevenue' })}
                </Typography>
                <Typography variant='body1' sx={{ textAlign: 'right', fontWeight: 600 }}>
                  {formatRevenue(currentAccount.max_annual_revenue)}
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle2' color='textSecondary'>
                  {intl.formatMessage({ id: 'accounts.view.expenseRate' })}
                </Typography>
                <Typography variant='body1' sx={{ textAlign: 'right', fontWeight: 600 }}>
                  {formatExpenseRate(currentAccount.expense_rate)}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Informations système */}
        <Card variant='outlined' sx={{ borderRadius: '10px' }}>
          <CardContent>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              {intl.formatMessage({ id: 'accounts.view.systemInfo' })}
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
                  {intl.formatMessage({ id: 'accounts.view.createdAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentAccount.created_at).toLocaleDateString(
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
                  {intl.formatMessage({ id: 'accounts.view.updatedAt' })}
                </Typography>
                <Typography variant='body1'>
                  {new Date(currentAccount.updated_at).toLocaleDateString(
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
        title={intl.formatMessage({ id: 'accounts.delete.title' })}
        message={
          intl.formatMessage(
            {
              id: 'accounts.delete.message',
            },
            {
              name: getAccountFullName(currentAccount),
            }
          ) +
          '\n\n' +
          intl.formatMessage({ id: 'accounts.delete.warning' })
        }
        onConfirm={handleDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        confirmText={intl.formatMessage({ id: 'accounts.actions.delete' })}
        cancelText={intl.formatMessage({ id: 'common.cancel' })}
      />
    </Box>
  );
};

export default AccountView;
