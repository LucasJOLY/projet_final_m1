import { Box, TextField, Button, Typography, Link, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIntl } from '../language/config/translation';
import { validatePassword, validateEmail } from './service';
import { useDispatch } from 'react-redux';
import { signUp } from './store/slice';
import type { AppDispatch } from '../store';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginBackground from './LoginBackground';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
  first_name: string;
  birth_date: string;
  address: string;
  city: string;
  phone: string;
  max_annual_revenue: number;
  expense_rate: number;
}

const locale = localStorage.getItem('locale') || 'fr';

const schema = yup.object().shape({
  email: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .email(getIntl(locale).formatMessage({ id: 'validation.email' })),
  password: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .min(8, getIntl(locale).formatMessage({ id: 'validation.passwordLength' })),
  confirmPassword: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .oneOf(
      [yup.ref('password')],
      getIntl(locale).formatMessage({ id: 'validation.passwordMatch' })
    ),
  name: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  first_name: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  birth_date: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .test('is-future', getIntl(locale).formatMessage({ id: 'validation.birthDate' }), (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  address: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  city: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
  phone: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .matches(/^[0-9]{10}$/, getIntl(locale).formatMessage({ id: 'validation.phone' })),
  max_annual_revenue: yup
    .number()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .transform((value) => (isNaN(value) ? undefined : value)),
  expense_rate: yup
    .number()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .min(0, getIntl(locale).formatMessage({ id: 'validation.expenseRateMin' }))
    .max(100, getIntl(locale).formatMessage({ id: 'validation.expenseRateMax' }))
    .transform((value) => (isNaN(value) ? undefined : value)),
});

const Register = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      first_name: '',
      birth_date: '',
      address: '',
      city: '',
      phone: '',
      max_annual_revenue: 0,
      expense_rate: 0,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      validatePassword(data.password);
      await validateEmail(data.email);
      const result = await dispatch(
        signUp({
          email: data.email,
          password: data.password,
          confirm_password: data.confirmPassword,
          name: data.name,
          first_name: data.first_name,
          birth_date: data.birth_date,
          address: data.address,
          city: data.city,
          phone: data.phone,
          max_annual_revenue: data.max_annual_revenue,
          expense_rate: data.expense_rate,
        })
      );
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    } catch (error) {
      toast.error(getIntl(locale).formatMessage({ id: 'toast.registrationError' }));
    }
  };

  return (
    <>
      <LoginBackground />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          position: 'relative',
          zIndex: 1,
          py: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '800px',
            mx: 2,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              padding: { xs: '40px 20px', sm: '50px 40px' },
              width: '100%',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography
              component='h1'
              variant='h4'
              align='center'
              gutterBottom
              sx={{
                mb: 4,
                fontWeight: 600,
                color: 'text.primary',
              }}
            >
              {getIntl(locale).formatMessage({ id: 'auth.register.title' })}
            </Typography>
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                '& .MuiFormControl-root': {
                  width: '100%',
                },
                '& .MuiGrid-container': {
                  width: '100%',
                },
              }}
            >
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
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='name'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.name' })}
                      autoComplete='name'
                      autoFocus
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      id='first_name'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.firstName' })}
                      autoComplete='given-name'
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      id='email'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.email' })}
                      autoComplete='email'
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      id='birth_date'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.birthDate' })}
                      type='date'
                      error={!!errors.birth_date}
                      helperText={errors.birth_date?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                    />
                  )}
                />
                <Controller
                  name='password'
                  control={control}
                  render={({ field }) => (
                    <PasswordField
                      {...field}
                      label={getIntl(locale).formatMessage({ id: 'auth.register.password' })}
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
                      label={getIntl(locale).formatMessage({ id: 'auth.register.confirmPassword' })}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      showScore={false}
                    />
                  )}
                />
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='address'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.address' })}
                      error={!!errors.address}
                      helperText={errors.address?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                    />
                  )}
                />
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='city'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.city' })}
                      error={!!errors.city}
                      helperText={errors.city?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
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
                      id='phone'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.phone' })}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                    />
                  )}
                />
                <Controller
                  name='max_annual_revenue'
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      id='max_annual_revenue'
                      label={getIntl(locale).formatMessage({
                        id: 'auth.register.maxAnnualRevenue',
                      })}
                      type='number'
                      error={!!errors.max_annual_revenue}
                      helperText={errors.max_annual_revenue?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
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
                      id='expense_rate'
                      label={getIntl(locale).formatMessage({ id: 'auth.register.expenseRate' })}
                      type='number'
                      inputProps={{ min: 0, max: 100 }}
                      error={!!errors.expense_rate}
                      helperText={errors.expense_rate?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                    />
                  )}
                />
              </Box>
              <PrimaryButton
                type='submit'
                fullWidth
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {getIntl(locale).formatMessage({ id: 'auth.register.submit' })}
              </PrimaryButton>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Link
                  href='/login'
                  variant='body2'
                  sx={{
                    color: 'text.secondary',
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {getIntl(locale).formatMessage({ id: 'auth.register.login' })}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Register;
