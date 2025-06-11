import { useState } from 'react';
import { Box, TextField, Button, Typography, Link, Container, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getIntl } from '../language/config/translation';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implémenter la logique de réinitialisation du mot de passe
      toast.success(getIntl('fr').formatMessage({ id: 'toast.resetPasswordSuccess' }));
      navigate('/login');
    } catch (error) {
      toast.error(getIntl('fr').formatMessage({ id: 'toast.resetPasswordError' }));
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
            {getIntl('fr').formatMessage({ id: 'auth.forgotPassword.title' })}
          </Typography>
          <Typography variant='body2' align='center' sx={{ mb: 3 }}>
            {getIntl('fr').formatMessage({ id: 'auth.forgotPassword.description' })}
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin='normal'
              required
              fullWidth
              id='email'
              label={getIntl('fr').formatMessage({ id: 'auth.forgotPassword.email' })}
              name='email'
              autoComplete='email'
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              {getIntl('fr').formatMessage({ id: 'auth.forgotPassword.submit' })}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href='/login' variant='body2'>
                {getIntl('fr').formatMessage({ id: 'auth.forgotPassword.backToLogin' })}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;
