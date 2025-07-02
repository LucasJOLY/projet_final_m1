import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useIntl } from 'react-intl';
import SecondaryButton from './SecondaryButton';

interface BackButtonProps {
  fallbackPath?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ fallbackPath = '/quotes' }) => {
  const navigate = useNavigate();
  const intl = useIntl();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <SecondaryButton startIcon={<ArrowBackIcon />} onClick={handleBack}>
      {intl.formatMessage({ id: 'common.back' })}
    </SecondaryButton>
  );
};

export default BackButton;
