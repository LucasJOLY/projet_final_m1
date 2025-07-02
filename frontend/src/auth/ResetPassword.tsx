import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, TextField, Typography, Link, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getIntl } from '../language/config/translation';
import { resetPasswordAction, verifyResetTokenAction, clearResetTokenState } from './store/slice';
import type { AppDispatch, RootState } from '../store';
import LoginBackground from './LoginBackground';
import PasswordField from '../components/PasswordField';
import PrimaryButton from '../components/PrimaryButton';

const locale = localStorage.getItem('locale') || 'fr';

const schema = yup.object().shape({
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
});

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const ResetPassword = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const resetTokenValid = useSelector((state: RootState) => state.auth.resetTokenValid);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (token) {
      dispatch(verifyResetTokenAction(token));
    }
    return () => {
      dispatch(clearResetTokenState());
    };
  }, [dispatch, token]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (token) {
      try {
        const response = await dispatch(resetPasswordAction({ token, password: data.password }));
        if (response.meta.requestStatus === 'fulfilled') {
          navigate('/login');
        }
      } catch (error) {
        // L'erreur est déjà gérée dans l'API
      }
    }
  };

  if (resetTokenValid === false) {
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
          <Paper
            elevation={3}
            sx={{
              padding: { xs: '40px 20px', sm: '50px 40px' },
              width: '100%',
              maxWidth: '450px',
              mx: 2,
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
                color: 'error.main',
              }}
            >
              {getIntl(locale).formatMessage({ id: 'auth.resetPassword.expiredLink' })}
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Link href='/forgot-password' variant='body2'>
                {getIntl(locale).formatMessage({ id: 'auth.resetPassword.requestNewLink' })}
              </Link>
            </Box>
          </Paper>
        </Box>
      </>
    );
  }

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
              {getIntl(locale).formatMessage({ id: 'auth.resetPassword.title' })}
            </Typography>
            <Box
              component='form'
              onSubmit={handleSubmit(onSubmit)}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
            >
              <Controller
                name='password'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <PasswordField
                    {...field}
                    label={getIntl(locale).formatMessage({ id: 'auth.resetPassword.newPassword' })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                )}
              />
              <Controller
                name='confirmPassword'
                control={control}
                defaultValue=''
                render={({ field }) => (
                  <PasswordField
                    {...field}
                    label={getIntl(locale).formatMessage({
                      id: 'auth.resetPassword.confirmPassword',
                    })}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    showScore={false}
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
                {getIntl(locale).formatMessage({ id: 'auth.resetPassword.submit' })}
              </PrimaryButton>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
};

export default ResetPassword;
