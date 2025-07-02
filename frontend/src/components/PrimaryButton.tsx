import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledPrimaryButton = styled(Button)(({ theme }) => ({
  color: 'white',
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

interface PrimaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const PrimaryButton = ({ children, ...props }: PrimaryButtonProps) => {
  return <StyledPrimaryButton {...props}>{children}</StyledPrimaryButton>;
};

export default PrimaryButton;
