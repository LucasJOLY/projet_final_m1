import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Container,
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
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import type { AppDispatch, RootState } from '../store';
import { createClientAction } from './store/slice';
import type { ClientFormData } from './types';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { FaBuilding, FaUser } from 'react-icons/fa';
import BackButton from '../components/BackButton';

const schema = yup.object().shape({
  is_company: yup.boolean().required('validation.required'),
  name: yup.string().when('is_company', {
    is: true,
    then: (schema) => schema.required('validation.required'),
    otherwise: (schema) => schema.nullable(),
  }),
  contact_name: yup.string().required('validation.required'),
  contact_first_name: yup.string().when('is_company', {
    is: false,
    then: (schema) => schema.required('validation.required'),
    otherwise: (schema) => schema.nullable(),
  }),
  address: yup.string().required('validation.required'),
  city: yup.string().required('validation.required'),
  phone: yup.string().required('validation.required'),
  email: yup.string().email('validation.email').required('validation.required'),
}) as yup.ObjectSchema<ClientFormData>;

const AddClient: React.FC = () => {
  const theme = useTheme();
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const userData = useSelector((state: RootState) => state.auth.authUser);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<ClientFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      is_company: true,
      name: '',
      contact_name: '',
      contact_first_name: '',
      address: '',
      city: '',
      phone: '',
      email: '',
    },
  });

  const isCompany = watch('is_company');

  const onSubmit = async (data: ClientFormData) => {
    try {
      await dispatch(
        createClientAction({ clientData: data, accountId: userData?.id || 0 })
      ).unwrap();
      navigate('/clients');
    } catch (error) {
      // L'erreur est déjà gérée dans le service
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 2 },
          mb: 3,
        }}
      >
        <BackButton />
        <Typography
          component='h1'
          variant='h4'
          sx={{ color: theme.palette.primary.main, fontWeight: 'bold' }}
        >
          {intl.formatMessage({ id: 'clients.add.title' })}
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
          {/* Type de client */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'clients.form.basicInfo' })}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Controller
              name='is_company'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.is_company}>
                  <InputLabel shrink required>
                    {intl.formatMessage({ id: 'clients.form.type' })}
                  </InputLabel>
                  <Select
                    {...field}
                    value={field.value ? 1 : 0}
                    onChange={(e) => field.onChange(e.target.value === 1)}
                    label={intl.formatMessage({ id: 'clients.form.type' })}
                  >
                    <MenuItem value={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaBuilding />
                        {intl.formatMessage({ id: 'clients.form.company' })}
                      </Box>
                    </MenuItem>
                    <MenuItem value={0}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FaUser />
                        {intl.formatMessage({ id: 'clients.form.person' })}
                      </Box>
                    </MenuItem>
                  </Select>
                  {errors.is_company && (
                    <FormHelperText>
                      {intl.formatMessage({ id: errors.is_company.message })}
                    </FormHelperText>
                  )}
                </FormControl>
              )}
            />
          </Box>

          {/* Informations spécifiques au type */}
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
            {isCompany && (
              <Controller
                name='name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={intl.formatMessage({ id: 'clients.form.name' })}
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
            )}

            <Controller
              name='contact_name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'clients.form.contactName' })}
                  error={!!errors.contact_name}
                  helperText={
                    errors.contact_name
                      ? intl.formatMessage({ id: errors.contact_name.message })
                      : ''
                  }
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

            {!isCompany && (
              <Controller
                name='contact_first_name'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    label={intl.formatMessage({ id: 'clients.form.contactFirstName' })}
                    error={!!errors.contact_first_name}
                    helperText={
                      errors.contact_first_name
                        ? intl.formatMessage({ id: errors.contact_first_name.message })
                        : ''
                    }
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
            )}

            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'clients.form.phone' })}
                  error={!!errors.phone}
                  helperText={errors.phone ? intl.formatMessage({ id: errors.phone.message }) : ''}
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
          </Box>

          {/* Email */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'clients.form.contactInfo' })}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'clients.form.email' })}
                  error={!!errors.email}
                  helperText={errors.email ? intl.formatMessage({ id: errors.email.message }) : ''}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />
          </Box>

          {/* Adresse */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {intl.formatMessage({ id: 'clients.form.addressInfo' })}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'clients.form.address' })}
                  error={!!errors.address}
                  helperText={
                    errors.address ? intl.formatMessage({ id: errors.address.message }) : ''
                  }
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />
          </Box>

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
              name='city'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={intl.formatMessage({ id: 'clients.form.city' })}
                  error={!!errors.city}
                  helperText={errors.city ? intl.formatMessage({ id: errors.city.message }) : ''}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />
          </Box>

          {/* Boutons */}
          <Box display='flex' gap={2} justifyContent='flex-end' mt={4}>
            <SecondaryButton onClick={() => navigate('/clients')} disabled={isSubmitting}>
              {intl.formatMessage({ id: 'clients.form.cancel' })}
            </SecondaryButton>
            <PrimaryButton type='submit' disabled={isSubmitting} sx={{ px: 4 }}>
              {isSubmitting ? (
                <CircularProgress size={20} color='inherit' />
              ) : (
                intl.formatMessage({ id: 'clients.form.save' })
              )}
            </PrimaryButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddClient;
