import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Container,
  Paper,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signIn } from './store/slice';
import { getIntl } from '../language/config/translation';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface LoginFormData {
  email: string;
  password: string;
  stayConnected: boolean;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required(getIntl('fr').formatMessage({ id: 'validation.required' }))
    .email(getIntl('fr').formatMessage({ id: 'validation.email' })),
  password: yup.string().required(getIntl('fr').formatMessage({ id: 'validation.required' })),
  stayConnected: yup.boolean().default(false),
});

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
      stayConnected: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await dispatch(
        signIn({
          email: data.email,
          password: data.password,
          stayConnected: data.stayConnected,
        })
      );
      if (result.meta.requestStatus === 'fulfilled') {
        navigate('/');
        window.location.reload();
      }
    } catch (error) {
      toast.error(getIntl('fr').formatMessage({ id: 'toast.loginError' }));
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        backgroundColor: '#4780ff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: '70px 40px', width: '70%', borderRadius: '20px' }}>
          <Typography component='h1' variant='h5' align='center' gutterBottom>
            {getIntl('fr').formatMessage({ id: 'auth.login.title' })}
          </Typography>
          <Box component='form' onSubmit={handleSubmit(onSubmit)}>
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
                  label={getIntl('fr').formatMessage({ id: 'auth.login.email' })}
                  autoComplete='email'
                  autoFocus
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
                  label={getIntl('fr').formatMessage({ id: 'auth.login.password' })}
                  type='password'
                  id='password'
                  autoComplete='current-password'
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            <Controller
              name='stayConnected'
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      color='primary'
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label={getIntl('fr').formatMessage({ id: 'toast.stayConnected' })}
                />
              )}
            />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              {getIntl('fr').formatMessage({ id: 'auth.login.submit' })}
            </Button>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Link href='/forgot-password' variant='body2'>
                {getIntl('fr').formatMessage({ id: 'auth.login.forgotPassword' })}
              </Link>
              <Link href='/register' variant='body2'>
                {getIntl('fr').formatMessage({ id: 'auth.login.register' })}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default Login;
