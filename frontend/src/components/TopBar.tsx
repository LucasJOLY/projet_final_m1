import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
} from '@mui/material';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  LightMode,
  DarkMode,
  KeyboardArrowDown,
  Person,
  Logout,
  Language,
} from '@mui/icons-material';
import { FaFlag } from 'react-icons/fa';

import type { AppDispatch, RootState } from '../store';
import { logout } from '../auth/store/slice';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../hooks/useLanguage';
import { RiMenuFill } from 'react-icons/ri';
import ReactCountryFlag from 'react-country-flag';

interface TopBarProps {
  isCollapsed: boolean;
  drawerWidth: number;
  collapsedDrawerWidth: number;
  handleDrawerToggle: () => void;
  isMobile?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  isCollapsed,
  drawerWidth,
  collapsedDrawerWidth,
  handleDrawerToggle,
  isMobile,
}) => {
  const intl = useIntl();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const { language, changeLanguage } = useLanguage();

  const [languageAnchorEl, setLanguageAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  // Données utilisateur (à remplacer par les vraies données de l'utilisateur connecté)

  const handleLanguageClick = (event: React.MouseEvent<HTMLElement>) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchorEl(null);
  };

  const handleLanguageChange = (newLanguage: string) => {
    changeLanguage(newLanguage);
    handleLanguageClose();
  };

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    handleUserClose();
  };

  const handleProfile = () => {
    navigate(`/profile`);
    handleUserClose();
  };

  const getLanguageFlag = () => {
    return (
      <ReactCountryFlag
        countryCode={language === 'fr' ? 'FR' : 'US'}
        svg
        style={{ marginRight: '10px', borderRadius: '50%' }}
      />
    );
  };

  const getLanguageName = () => {
    return language === 'fr' ? 'Français' : 'English';
  };

  const userData = useSelector((state: RootState) => state.auth.authUser);

  const languageOpen = Boolean(languageAnchorEl);
  const userOpen = Boolean(userAnchorEl);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        right: 0,
        left: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        height: 64,
        backgroundColor: isDarkMode ? '#273142' : '#fff',
        borderBottom: isDarkMode ? '1px solid #1b2431' : '1px solid #e0e0e0',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        gap: isMobile ? 0 : 2,
        borderRadius: isMobile ? '0 0 20px 20px' : 'none',
      }}
    >
      <Box>
        {!isCollapsed && !isMobile && (
          <IconButton
            color='inherit'
            aria-label='toggle drawer'
            edge='start'
            onClick={() => {
              handleDrawerToggle();
            }}
            sx={{
              mr: 2,
              color: isDarkMode ? '#fff' : '#4780ff',
              borderRadius: '10px',
              '&:hover': {
                color: isDarkMode ? '#fff' : '#4780ff',
              },
            }}
          >
            <RiMenuFill />
          </IconButton>
        )}
        {isMobile && (
          <Typography variant='h6' sx={{ color: '#4780ff', fontWeight: 'bold' }}>
            Projet M1
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: isMobile ? 0 : 2 }}>
        {/* Bouton de thème */}
        <IconButton
          onClick={toggleTheme}
          sx={{
            color: isDarkMode ? '#f57c00' : '#ff9800',
            '&:hover': {
              backgroundColor: 'rgba(255, 152, 0, 0.1)',
            },
          }}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

        {/* Sélecteur de langue */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '8px',
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: isDarkMode ? '#1b2431' : '#f5f5f5',
            },
          }}
          onClick={handleLanguageClick}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 1 }}>
            {getLanguageFlag()}
            {!isMobile && (
              <Typography variant='body2' sx={{ color: isDarkMode ? '#fff' : '#333' }}>
                {getLanguageName()}
              </Typography>
            )}
          </Box>
          <KeyboardArrowDown sx={{ color: isDarkMode ? '#fff' : '#666' }} />
        </Box>

        {/* Menu utilisateur */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            borderRadius: '12px',
            px: 2,
            py: 1,
            '&:hover': {
              backgroundColor: isDarkMode ? '#1b2431' : '#f5f5f5',
            },
          }}
          onClick={handleUserClick}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mr: 1 }}>
            <Typography
              variant='body2'
              sx={{ color: isDarkMode ? '#fff' : '#333', fontWeight: 500, lineHeight: 1.2 }}
            >
              {userData?.first_name} {userData?.name}
            </Typography>
          </Box>
          <KeyboardArrowDown sx={{ color: isDarkMode ? '#fff' : '#666' }} />
        </Box>

        {/* Popover pour la langue */}
        <Popover
          open={languageOpen}
          anchorEl={languageAnchorEl}
          onClose={handleLanguageClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: '20px',
              backgroundColor: isDarkMode ? '#273142' : '#fff',
              backgroundImage: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <Typography variant='subtitle2' sx={{ color: isDarkMode ? '#fff' : '#666', mb: 1 }}>
              {intl.formatMessage({ id: 'topbar.changeLanguage' })}
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List sx={{ p: 0 }}>
              <ListItem sx={{ p: 0 }}>
                <ListItemButton
                  onClick={() => handleLanguageChange('fr')}
                  sx={{
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#1b2431' : '#f0f4ff',
                    },
                  }}
                >
                  <ReactCountryFlag
                    countryCode='FR'
                    svg
                    style={{ marginRight: '10px', borderRadius: '50%' }}
                  />

                  <ListItemText
                    primary={intl.formatMessage({ id: 'topbar.french' })}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ p: 0 }}>
                <ListItemButton
                  onClick={() => handleLanguageChange('en')}
                  sx={{
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#1b2431' : '#f0f4ff',
                    },
                  }}
                >
                  <ReactCountryFlag
                    countryCode='US'
                    svg
                    style={{ marginRight: '10px', borderRadius: '50%' }}
                  />
                  <ListItemText
                    primary={intl.formatMessage({ id: 'topbar.english' })}
                    primaryTypographyProps={{ fontSize: 14 }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Popover>

        {/* Popover pour l'utilisateur */}
        <Popover
          open={userOpen}
          anchorEl={userAnchorEl}
          onClose={handleUserClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: '20px',
              backgroundColor: isDarkMode ? '#273142' : '#fff',
              backgroundImage: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, minWidth: 200 }}>
            <List sx={{ p: 0 }}>
              <ListItem sx={{ p: 0 }}>
                <ListItemButton
                  onClick={handleProfile}
                  sx={{
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#1b2431' : '#f0f4ff',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Person sx={{ color: '#4780ff' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage({ id: 'topbar.myProfile' })}
                    primaryTypographyProps={{
                      fontSize: 14,
                      color: '#4780ff',
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem sx={{ p: 0 }}>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: isDarkMode ? '#1b2431' : '#fff5f5',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Logout sx={{ color: '#f44336' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={intl.formatMessage({ id: 'topbar.logout' })}
                    primaryTypographyProps={{ fontSize: 14, color: '#f44336' }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Popover>
      </Box>
    </Box>
  );
};

export default TopBar;
