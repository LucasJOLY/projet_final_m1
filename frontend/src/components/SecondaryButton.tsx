import { Button } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledSecondaryButton = styled(Button)(({ theme }) => ({
  backgroundColor: 'transparent',
  color: theme.palette.primary.main,
  border: `1px solid ${theme.palette.primary.main}`,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    color: 'white',
  },
  '&:disabled': {
    backgroundColor: 'transparent',
    color: theme.palette.action.disabled,
    border: `1px solid ${theme.palette.action.disabled}`,
  },
}));

interface SecondaryButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const SecondaryButton = ({ children, ...props }: SecondaryButtonProps) => {
  return <StyledSecondaryButton {...props}>{children}</StyledSecondaryButton>;
};

export default SecondaryButton;
