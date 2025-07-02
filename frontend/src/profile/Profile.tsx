import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { getIntl } from '../language/config/translation';
import { fetchProfile, updateProfileAction } from './store/slice';
import { clearProfileError } from './store/slice';
import type { AppDispatch, RootState } from '../store';
import type { UpdateProfileData } from './types';
import PasswordField from '../components/PasswordField';
import { formatDateForInput, formatCurrency } from './service';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
const locale = localStorage.getItem('language') || 'fr';
interface ProfileFormData {
  id: number;
  name: string;
  first_name: string;
  email: string;
  birth_date: string;
  address: string;
  phone: string;
  max_annual_revenue: number;
  expense_rate: number;
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  id: yup.number().required(),
  name: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  first_name: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  email: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .email(getIntl(locale).formatMessage({ id: 'validation.email' })),
  birth_date: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .test('is-future', getIntl(locale).formatMessage({ id: 'validation.birthDate' }), (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  address: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  phone: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .matches(/^[0-9]{10}$/, getIntl(locale).formatMessage({ id: 'validation.phone' })),
  max_annual_revenue: yup
    .number()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .min(0, getIntl(locale).formatMessage({ id: 'validation.maxAnnualRevenueMin' }))
    .transform((value) => (isNaN(value) ? undefined : value)),
  expense_rate: yup
    .number()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .min(0, getIntl(locale).formatMessage({ id: 'validation.expenseRateMin' }))
    .max(100, getIntl(locale).formatMessage({ id: 'validation.expenseRateMax' }))
    .transform((value) => (isNaN(value) ? undefined : value)),
  password: yup
    .string()
    .optional()

    .default(''),
  confirmPassword: yup
    .string()
    .optional()
    .oneOf([yup.ref('password')], getIntl(locale).formatMessage({ id: 'validation.passwordMatch' }))
    .default(''),
});

const Profile = () => {
  const locale = localStorage.getItem('language') || 'fr';
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector((state: RootState) => state.profile);
  const [isEditing, setIsEditing] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      id: 0,
      name: '',
      first_name: '',
      email: '',
      birth_date: '',
      address: '',
      phone: '',
      max_annual_revenue: 0,
      expense_rate: 0,
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      console.log(profile.birth_date);
      reset({
        id: profile.id,
        name: profile.name,
        first_name: profile.first_name,
        email: profile.email,
        birth_date: formatDateForInput(profile.birth_date),
        address: profile.address,
        phone: profile.phone,
        max_annual_revenue: profile.max_annual_revenue,
        expense_rate: profile.expense_rate,
        password: '',
        confirmPassword: '',
      });
    }
  }, [profile, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearProfileError());
    }
  }, [error, dispatch]);

  const onSubmit = async (data: ProfileFormData) => {
    console.log(data);
    try {
      const updateData: UpdateProfileData = {
        id: data.id,
        name: data.name,
        first_name: data.first_name,
        email: data.email,
        birth_date: data.birth_date,
        address: data.address,
        phone: data.phone,
        max_annual_revenue: data.max_annual_revenue,
        expense_rate: data.expense_rate,
        password: data.password || undefined,
        confirmPassword: data.confirmPassword || undefined,
      };

      const result = await dispatch(updateProfileAction(updateData));
      if (result.meta.requestStatus === 'fulfilled') {
        setIsEditing(false);
      }
    } catch (error) {}
  };

  const handleCancel = () => {
    if (profile) {
      reset({
        id: profile.id,
        name: profile.name,
        first_name: profile.first_name,
        email: profile.email,
        birth_date: formatDateForInput(profile.birth_date),
        address: profile.address,
        phone: profile.phone,
        max_annual_revenue: profile.max_annual_revenue,
        expense_rate: profile.expense_rate,
        password: '',
        confirmPassword: '',
      });
    }
    setIsEditing(false);
  };

  if (loading && !profile) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
        <Box display='flex' justifyContent='center' alignItems='center' minHeight='400px'>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
        <Alert severity='error'>{getIntl(locale).formatMessage({ id: 'profile.loadError' })}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth='md' sx={{ mt: 4, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          padding: { xs: '20px', sm: '40px' },
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          backgroundImage: 'none',
        }}
      >
        <Box display='flex' justifyContent='space-between' alignItems='center' mb={3}>
          <Typography
            component='h1'
            variant='h4'
            sx={{
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            {getIntl(locale).formatMessage({ id: 'profile.title' })}
          </Typography>
          {!isEditing && (
            <PrimaryButton onClick={() => setIsEditing(true)} sx={{ px: 3 }}>
              {getIntl(locale).formatMessage({ id: 'profile.edit' })}
            </PrimaryButton>
          )}
        </Box>

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            '& .MuiFormControl-root': {
              width: '100%',
            },
          }}
        >
          {/* Informations personnelles */}
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {getIntl(locale).formatMessage({ id: 'profile.personalInfo' })}
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
                  label={getIntl(locale).formatMessage({ id: 'profile.name' })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />

            <Controller
              name='first_name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.firstName' })}
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />

            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.email' })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />

            <Controller
              name='birth_date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.birthDate' })}
                  type='date'
                  error={!!errors.birth_date}
                  helperText={errors.birth_date?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />

            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.phone' })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />
          </Box>

          {/* Adresse */}
          <Divider sx={{ my: 3 }} />
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {getIntl(locale).formatMessage({ id: 'profile.address' })}
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
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.address' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                />
              )}
            />
          </Box>

          {/* Informations financières */}
          <Divider sx={{ my: 3 }} />
          <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
            {getIntl(locale).formatMessage({ id: 'profile.financialInfo' })}
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
              name='max_annual_revenue'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.maxAnnualRevenue' })}
                  type='number'
                  error={!!errors.max_annual_revenue}
                  helperText={errors.max_annual_revenue?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  InputProps={{
                    startAdornment: <span>€</span>,
                  }}
                />
              )}
            />

            <Controller
              name='expense_rate'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  required
                  fullWidth
                  label={getIntl(locale).formatMessage({ id: 'profile.expenseRate' })}
                  type='number'
                  inputProps={{ min: 0, max: 100 }}
                  error={!!errors.expense_rate}
                  helperText={errors.expense_rate?.message}
                  disabled={!isEditing}
                  InputLabelProps={{ shrink: true }}
                  variant='outlined'
                  InputProps={{
                    endAdornment: <span>%</span>,
                  }}
                />
              )}
            />
          </Box>

          {/* Mot de passe (optionnel) */}
          {isEditing && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
                {getIntl(locale).formatMessage({ id: 'profile.changePassword' })}
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
                {getIntl(locale).formatMessage({ id: 'profile.passwordOptional' })}
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
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <PasswordField
                      {...field}
                      label={getIntl(locale).formatMessage({ id: 'profile.newPassword' })}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />

                <Controller
                  name='confirmPassword'
                  control={control}
                  render={({ field }) => (
                    <PasswordField
                      {...field}
                      label={getIntl(locale).formatMessage({ id: 'profile.confirmPassword' })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      showScore={false}
                    />
                  )}
                />
              </Box>
            </>
          )}

          {/* Boutons d'action */}
          {isEditing && (
            <Box display='flex' gap={2} justifyContent='flex-end' mt={4}>
              <SecondaryButton onClick={handleCancel} disabled={loading}>
                {getIntl(locale).formatMessage({ id: 'profile.cancel' })}
              </SecondaryButton>
              <PrimaryButton type='submit' disabled={loading} sx={{ px: 4 }}>
                {loading ? (
                  <CircularProgress size={20} color='inherit' />
                ) : (
                  getIntl(locale).formatMessage({ id: 'profile.save' })
                )}
              </PrimaryButton>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile;
