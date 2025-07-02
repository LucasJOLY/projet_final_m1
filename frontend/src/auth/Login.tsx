import { Box, TextField, Typography, Link, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signIn } from './store/slice';
import { getIntl } from '../language/config/translation';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import LoginBackground from './LoginBackground';
import CustomCheckbox from '../components/CustomCheckbox';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';

const locale = localStorage.getItem('locale') || 'fr';

interface LoginFormData {
  email: string;
  password: string;
  stayConnected: boolean;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .email(getIntl(locale).formatMessage({ id: 'validation.email' })),
  password: yup.string().required(getIntl(locale).formatMessage({ id: 'validation.required' })),
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
      }
    } catch (error) {
      toast.error(getIntl(locale).formatMessage({ id: 'toast.loginError' }));
    }
  };

  return (
    <>
      <LoginBackground />
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: '450px',
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
              {getIntl(locale).formatMessage({ id: 'auth.login.title' })}
            </Typography>
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Controller
                name='email'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    required
                    fullWidth
                    id='email'
                    label={getIntl(locale).formatMessage({ id: 'auth.login.email' })}
                    autoComplete='email'
                    autoFocus
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{ mb: 1 }}
                  />
                )}
              />
              <Controller
                name='password'
                control={control}
                render={({ field }) => (
                  <PasswordField
                    {...field}
                    label={getIntl(locale).formatMessage({ id: 'auth.login.password' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    showScore={false}
                  />
                )}
              />
              <Controller
                name='stayConnected'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <CustomCheckbox
                    checked={value}
                    onChange={onChange}
                    label={getIntl(locale).formatMessage({ id: 'toast.stayConnected' })}
                  />
                )}
              />
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
                {getIntl(locale).formatMessage({ id: 'auth.login.submit' })}
              </PrimaryButton>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mt: 2,
                }}
              >
                <Link
                  href='/forgot-password'
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
                  {getIntl(locale).formatMessage({ id: 'auth.login.forgotPassword' })}
                </Link>
                <Link
                  href='/register'
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
                  {getIntl(locale).formatMessage({ id: 'auth.login.register' })}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default Login;
