import React, { useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  useTheme,
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { AppDispatch, RootState } from '../store';
import { createProjectAction } from './store/slice';
import { fetchClients } from '../clients/store/slice';
import type { ProjectFormData, ProjectStatus } from './types';
import type { Client } from '../clients/types';
import { PROJECT_STATUS_OPTIONS } from './utils';
import { getClientDisplayName, getClientTypeIcon } from '../clients/utils';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import BackButton from '../components/BackButton';

const schema = yup.object().shape({
  name: yup.string().required('validation.required'),
  client_id: yup.number().required('validation.required'),
  status: yup
    .number()
    .required('validation.required')
    .oneOf(PROJECT_STATUS_OPTIONS.map((option) => option.value))
    .transform((value) => Number(value)),
}) as yup.ObjectSchema<ProjectFormData>;

const AddProject: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userData = useSelector((state: RootState) => state.auth.authUser);
  const { clients } = useSelector((state: RootState) => state.clients);

  // Récupérer le client_id depuis les paramètres d'URL si présent
  const preselectedClientId = searchParams.get('client_id');

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProjectFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      client_id: preselectedClientId ? parseInt(preselectedClientId) : 0,
      status: 0 as ProjectStatus,
    },
  });

  // Charger les clients au montage
  useEffect(() => {
    dispatch(fetchClients({}));
  }, [dispatch]);

  // Pré-sélectionner le client si fourni dans l'URL
  useEffect(() => {
    if (preselectedClientId) {
      setValue('client_id', parseInt(preselectedClientId));
    }
  }, [preselectedClientId, setValue]);

  const onSubmit = async (data: ProjectFormData) => {
    try {
      await dispatch(
        createProjectAction({ projectData: data, accountId: userData?.id || 0 })
      ).unwrap();
      navigate('/projects');
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'auto 1fr' },
          gap: { xs: 2, sm: 2 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}
      >
        <BackButton />
        <Typography
          component='h1'
          variant='h4'
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {intl.formatMessage({ id: 'projects.add.title' })}
        </Typography>
      </Box>

      {/* Formulaire */}
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
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            '& .MuiFormControl-root': {
              width: '100%',
            },
          }}
        >
          {/* Informations de base */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'projects.form.basicInfo' })}
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                md: '1fr 1fr',
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'projects.form.name' })}
                  error={!!errors.name}
                  helperText={errors.name ? intl.formatMessage({ id: errors.name.message }) : ''}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  sx={{
                    '& .MuiInputBase-input': {
                      color: '#333333',
                    },
                  }}
                />
              )}
            />

            <Controller
              name='client_id'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.client_id}>
                  <InputLabel shrink required>
                    {intl.formatMessage({ id: 'projects.form.client' })}
                  </InputLabel>
                  <Select
                    {...field}
                    label={intl.formatMessage({ id: 'projects.form.client' })}
                    displayEmpty
                    sx={{
                      '& .MuiSelect-select': {
                        color: '#333333',
                      },
                    }}
                  >
                    <MenuItem value={0} disabled>
                      <em>
                        {intl.formatMessage({ id: 'projects.form.selectClient' }) ||
                          'Sélectionnez un client'}
                      </em>
                    </MenuItem>
                    {clients.map((client: Client) => (
                      <MenuItem key={client.id} value={client.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {getClientTypeIcon(client)} {getClientDisplayName(client)}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.client_id && (
                    <FormHelperText>
                      {intl.formatMessage({ id: errors.client_id.message })}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name='status'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.status}>
                  <InputLabel shrink required>
                    {intl.formatMessage({ id: 'projects.form.status' })}
                  </InputLabel>
                  <Select
                    {...field}
                    label={intl.formatMessage({ id: 'projects.form.status' })}
                    sx={{
                      '& .MuiSelect-select': {
                        color: '#333333',
                      },
                    }}
                  >
                    {PROJECT_STATUS_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              backgroundColor: option.backgroundColor,
                            }}
                          />
                          {intl.formatMessage({ id: option.label })}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.status && (
                    <FormHelperText>
                      {intl.formatMessage({ id: errors.status.message })}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          {/* Boutons */}
          <Box
            sx={{
              display: 'flex',
              gap: 2,
              justifyContent: 'flex-end',
              mt: 4,
            }}
          >
            <SecondaryButton onClick={() => navigate('/projects')} disabled={isSubmitting}>
              {intl.formatMessage({ id: 'projects.form.cancel' })}
            </SecondaryButton>
            <PrimaryButton type='submit' disabled={isSubmitting} sx={{ px: 4 }}>
              {isSubmitting ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                intl.formatMessage({ id: 'projects.form.save' })
              )}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddProject;
