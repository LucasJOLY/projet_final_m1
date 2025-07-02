import React, { useEffect } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { AppDispatch, RootState } from '../store';
import { fetchInvoices } from './store/slice';
import InvoiceList from './InvoiceList';
import PrimaryButton from '../components/PrimaryButton';

const Invoices: React.FC = () => {
  const intl = useIntl();
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr auto' },
          gap: { xs: 2, sm: 0 },
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
        }}
      >
        <Typography
          variant='h4'
          component='h1'
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
          }}
        >
          {intl.formatMessage({ id: 'invoices.title' })}
        </Typography>
      </Box>

      {/* Liste des factures */}
      <InvoiceList showProjectColumn={true} showClientColumn={true} showAddButton={false} />
    </Box>
  );
};

export default Invoices;
