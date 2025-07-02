import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Link, Paper, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { forgotPasswordAction } from './store/slice';
import LoginBackground from './LoginBackground';
import { getIntl } from '../language/config/translation';
import type { AppDispatch, RootState } from '../store';
import PrimaryButton from '../components/PrimaryButton';

const locale = localStorage.getItem('locale') || 'fr';

const schema = yup.object().shape({
  email: yup
    .string()
    .required(getIntl(locale).formatMessage({ id: 'validation.required' }))
    .email(getIntl(locale).formatMessage({ id: 'validation.email' })),
});

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loadingSendEmail = useSelector((state: RootState) => state.auth.loadingSendEmail);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await dispatch(forgotPasswordAction(data.email));
      if (response.meta.requestStatus === 'fulfilled') {
        navigate('/login');
      }
    } catch (error) {
      // L'erreur est déjà gérée dans l'API
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
              {getIntl(locale).formatMessage({ id: 'auth.forgotPassword.title' })}
            </Typography>
            <Typography
              variant='body2'
              align='center'
              sx={{
                mb: 3,
                color: 'text.secondary',
              }}
            >
              {getIntl(locale).formatMessage({ id: 'auth.forgotPassword.description' })}
            </Typography>
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Controller
                name='email'
                control={control}
                defaultValue=''
                render={({ field }) =>
                  loadingSendEmail ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                      <CircularProgress size={24} />
                    </Box>
                  ) : (
                    <TextField
                      {...field}
                      required
                      fullWidth
                      label={getIntl(locale).formatMessage({ id: 'auth.forgotPassword.email' })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                    />
                  )
                }
              />
              <PrimaryButton
                type='submit'
                fullWidth
                disabled={loadingSendEmail}
                sx={{
                  mt: 2,
                  mb: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                }}
              >
                {getIntl(locale).formatMessage({ id: 'auth.forgotPassword.submit' })}
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
                  {getIntl(locale).formatMessage({ id: 'auth.forgotPassword.backToLogin' })}
                </Link>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ForgotPassword;
