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

const schema = yup.object().shape({
  email: yup
    .string()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .email(getIntl('fr').formatMessage({ id: 'validation.email' })),
  password: yup
    .string()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .min(8, getIntl('fr').formatMessage({ id: 'validation.passwordLength' })),
  confirmPassword: yup
    .string()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .oneOf([yup.ref('password')], getIntl('fr').formatMessage({ id: 'validation.passwordMatch' })),
  name: yup.string().required(getIntl('fr').formatMessage({ id: 'validation.required' })),
  first_name: yup.string().required(getIntl('fr').formatMessage({ id: 'validation.required' })),
  birth_date: yup
    .string()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .test('is-future', getIntl('fr').formatMessage({ id: 'validation.birthDate' }), (value) => {
      if (!value) return true;
      return new Date(value) <= new Date();
    }),
  address: yup.string().required(getIntl('fr').formatMessage({ id: 'validation.required' })),
  city: yup.string().required(getIntl('fr').formatMessage({ id: 'validation.required' })),
  phone: yup
    .string()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .matches(/^[0-9]{10}$/, getIntl('fr').formatMessage({ id: 'validation.phone' })),
  max_annual_revenue: yup
    .number()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .transform((value) => (isNaN(value) ? undefined : value)),
  expense_rate: yup
    .number()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
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
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      toast.error(getIntl('fr').formatMessage({ id: 'toast.registrationError' }));
    }
  };

  return (
    <Container component='main' maxWidth='xs'>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            {getIntl('fr').formatMessage({ id: 'auth.register.title' })}
          </Typography>
          <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='name'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.name' })}
                  autoComplete='name'
                  autoFocus
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name='first_name'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='first_name'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.firstName' })}
                  autoComplete='given-name'
                  error={!!errors.first_name}
                  helperText={errors.first_name?.message}
                />
              )}
            />
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='email'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.email' })}
                  autoComplete='email'
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  name='password'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.password' })}
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  name='confirmPassword'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.confirmPassword' })}
                  type='password'
                  id='confirmPassword'
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                />
              )}
            />
            <Controller
              name='birth_date'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='birth_date'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.birthDate' })}
                  type='date'
                  error={!!errors.birth_date}
                  helperText={errors.birth_date?.message}
                  InputLabelProps={{ shrink: true }}
                />
              )}
            />
            <Controller
              name='address'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='address'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.address' })}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
            <Controller
              name='city'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='city'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.city' })}
                  error={!!errors.city}
                  helperText={errors.city?.message}
                />
              )}
            />
            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  required
                  fullWidth
                  id='phone'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.phone' })}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                />
              )}
            />
            <Controller
              name='max_annual_revenue'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  fullWidth
                  id='max_annual_revenue'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.maxAnnualRevenue' })}
                  type='number'
                  error={!!errors.max_annual_revenue}
                  helperText={errors.max_annual_revenue?.message}
                />
              )}
            />
            <Controller
              name='expense_rate'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  margin='normal'
                  fullWidth
                  id='expense_rate'
                  label={getIntl('fr').formatMessage({ id: 'auth.register.expenseRate' })}
                  type='number'
                  error={!!errors.expense_rate}
                  helperText={errors.expense_rate?.message}
                />
              )}
            />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              {getIntl('fr').formatMessage({ id: 'auth.register.submit' })}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href='/login' variant='body2'>
                {getIntl('fr').formatMessage({ id: 'auth.register.login' })}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
