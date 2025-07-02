import { useMediaQuery, useTheme } from '@mui/material';
import WebLayout from './WebLayout';
import MobileLayout from './MobileLayout';

const MainLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return isMobile ? <MobileLayout /> : <WebLayout />;
};

export default MainLayout;
