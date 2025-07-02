import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  BottomNavigation,
  BottomNavigationAction,
  useTheme,
} from '@mui/material';
import { Dashboard } from '@mui/icons-material';
import { FaUsers } from 'react-icons/fa';
import { MdWork } from 'react-icons/md';
import { FaEuroSign } from 'react-icons/fa6';

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { getIntl } from '../language/config/translation';
import TopBar from '../components/TopBar';

const MobileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locale = localStorage.getItem('language') || 'fr';
  const isDarkMode = useTheme().palette.mode === 'dark';

  // Variables nécessaires pour TopBar (non utilisées sur mobile mais requises par l'interface)
  const drawerWidth = 220;
  const collapsedDrawerWidth = 80;
  const handleDrawerToggle = () => {}; // Fonction vide car pas de sidebar sur mobile

  const menuItems = [
    {
      text: getIntl(locale).formatMessage({ id: 'menu.dashboard' }),
      icon: <Dashboard />,
      path: '/dashboard',
    },
    {
      text: getIntl(locale).formatMessage({ id: 'menu.clients' }),
      icon: <FaUsers />,
      path: '/clients',
    },
    {
      text: getIntl(locale).formatMessage({ id: 'menu.projects' }),
      icon: <MdWork />,
      path: '/projects',
    },
    {
      text: getIntl(locale).formatMessage({ id: 'menu.invoices' }),
      icon: <FaEuroSign />,
      path: '/invoices',
    },
  ];

  // Trouver l'index de l'élément actif
  const getActiveIndex = () => {
    const activeIndex = menuItems.findIndex((item) => item.path === location.pathname);
    return activeIndex >= 0 ? activeIndex : 0;
  };

  const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
    navigate(menuItems[newValue].path);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* TopBar */}
      <AppBar
        position='fixed'
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
          color: isDarkMode ? '#fff' : '#333',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <TopBar
          isCollapsed={true}
          drawerWidth={0}
          collapsedDrawerWidth={0}
          handleDrawerToggle={handleDrawerToggle}
          isMobile={true}
        />
      </AppBar>

      {/* Contenu principal */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 2,
          mt: 7, // Espace pour la topbar
          mb: 7, // Espace pour la bottom navigation
          overflow: 'auto',
        }}
      >
        <Outlet />
      </Box>

      {/* Bottom Navigation */}
      <BottomNavigation
        value={getActiveIndex()}
        onChange={handleNavigationChange}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: isDarkMode ? '#273142' : '#fff',
          height: 56,
          borderRadius: '20px 20px 0 0',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 12px',
            color: isDarkMode ? '#b2b2b2' : '#666',
            '&.Mui-selected': {
              color: '#4780ff',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.75rem',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
        }}
      >
        {menuItems.map((item, index) => (
          <BottomNavigationAction
            key={item.path}
            icon={item.icon}
            sx={{
              '& svg': {
                fontSize: 24,
              },
            }}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};

export default MobileLayout;
