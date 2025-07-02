import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string | React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
}) => {
  const intl = useIntl();

  const handleClose = () => {
    onCancel();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='sm'
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          minWidth: '400px',
        },
      }}
    >
      <DialogTitle
        sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Typography variant='h6' component='div'>
          {title}
        </Typography>
        <IconButton
          aria-label='close'
          onClick={handleClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2 }}>
        {typeof message === 'string' ? <Typography variant='body1'>{message}</Typography> : message}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <SecondaryButton onClick={onCancel}>
          {cancelText || intl.formatMessage({ id: 'common.cancel' })}
        </SecondaryButton>
        <PrimaryButton onClick={onConfirm} color='error'>
          {confirmText || intl.formatMessage({ id: 'common.confirm' })}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
