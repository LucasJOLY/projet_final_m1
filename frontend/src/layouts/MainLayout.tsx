import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
} from '@mui/material';
import { Dashboard, Person, Settings } from '@mui/icons-material';
import { CiPower } from 'react-icons/ci';
import { FaUsers } from 'react-icons/fa';
import { FaUsersCog } from 'react-icons/fa';
import { FaFileInvoiceDollar } from 'react-icons/fa6';
import { GoProjectRoadmap } from 'react-icons/go';

import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

import { RiMenu4Fill } from 'react-icons/ri';
import { RiMenuFill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../store';
import { logout } from '../auth/store/slice';

const drawerWidth = 220;
const collapsedDrawerWidth = 80;

const MainLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Clients', icon: <FaUsers />, path: '/clients' },
    { text: 'Projets', icon: <GoProjectRoadmap />, path: '/projects' },
    { text: 'Factures', icon: <FaFileInvoiceDollar />, path: '/invoices' },
  ];

  const restrictedMenuItems = [
    { text: 'Gestion utilisateurs', icon: <FaUsersCog />, path: '/users' },
  ];

  const canAccessRestrictedMenuItems = true;

  const getIconColor = (isActive: boolean, isCollapsed: boolean) => {
    if (isCollapsed) {
      return isActive ? '#4780ff' : '#b2b2b2';
    }
    return isActive ? '#fff' : 'black';
  };

  const getTextColor = (isActive: boolean, isCollapsed: boolean) => {
    if (isCollapsed) {
      return isActive ? '#4780ff' : '#b2b2b2';
    }
    return isActive ? '#fff' : 'black';
  };

  const drawer = (
    <div>
      <Toolbar
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 48 }}
      >
        {!isCollapsed && (
          <Typography
            variant='subtitle1'
            noWrap
            component='div'
            sx={{ fontSize: 18, color: '#4780ff', fontWeight: 'bold' }}
          >
            Projet M1
          </Typography>
        )}
        {isCollapsed && (
          <IconButton
            color='inherit'
            onClick={handleDrawerToggle}
            sx={{
              color: '#4780ff',

              borderRadius: '10px',
              '&:hover': {
                color: '#4780ff',
              },
            }}
          >
            {isCollapsed ? <RiMenu4Fill /> : <RiMenuFill />}
          </IconButton>
        )}
      </Toolbar>

      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '90vh',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div style={{ position: 'relative', marginBottom: 8 }}>
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: isCollapsed ? 5 : 6,
                      height: '100%',
                      background: '#4780ff',
                      borderTopRightRadius: 16,
                      borderBottomRightRadius: 16,
                      zIndex: 1,
                    }}
                  />
                )}
                <ListItemButton
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 30,
                    marginLeft: isCollapsed ? 0 : 2,
                    marginRight: isCollapsed ? 0 : 2,
                    justifyContent: isCollapsed ? 'center' : 'initial',
                    px: 1.5,
                    borderRadius: '8px',
                    backgroundColor: isActive && !isCollapsed ? '#4780ff' : 'transparent',
                    color: getTextColor(isActive, isCollapsed),
                    paddingLeft: isCollapsed ? 1.5 : '24px',
                    position: 'relative',
                    zIndex: 2,
                    '&:hover': {
                      backgroundColor: isActive && !isCollapsed ? '#4780ff' : '#f0f4ff',
                      color: getTextColor(isActive, isCollapsed),
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: isCollapsed ? 'none' : 1.5,
                      justifyContent: 'center',
                      color: getIconColor(isActive, isCollapsed),
                      fontSize: 18,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  {!isCollapsed && (
                    <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
                  )}
                </ListItemButton>
              </div>
            );
          })}
          {canAccessRestrictedMenuItems && <Divider sx={{ my: 2 }} />}
          {canAccessRestrictedMenuItems &&
            restrictedMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  {isActive && (
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: isCollapsed ? 5 : 6,
                        height: '100%',
                        background: '#4780ff',
                        borderTopRightRadius: 16,
                        borderBottomRightRadius: 16,
                        zIndex: 1,
                      }}
                    />
                  )}
                  <ListItemButton
                    onClick={() => navigate(item.path)}
                    sx={{
                      minHeight: 30,
                      marginLeft: isCollapsed ? 0 : 2,
                      marginRight: isCollapsed ? 0 : 2,
                      justifyContent: isCollapsed ? 'center' : 'initial',
                      px: 1.5,
                      borderRadius: '8px',
                      backgroundColor: isActive && !isCollapsed ? '#4780ff' : 'transparent',
                      color: getTextColor(isActive, isCollapsed),
                      paddingLeft: isCollapsed ? 1.5 : '24px',
                      position: 'relative',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: isActive && !isCollapsed ? '#4780ff' : '#f0f4ff',
                        color: getTextColor(isActive, isCollapsed),
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isCollapsed ? 'none' : 1.5,
                        justifyContent: 'center',
                        color: getIconColor(isActive, isCollapsed),
                        fontSize: 18,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && (
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: 14 }} />
                    )}
                  </ListItemButton>
                </div>
              );
            })}
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Divider sx={{ my: 2 }} />
          <ListItemButton
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
            sx={{
              minHeight: 30,
              marginLeft: isCollapsed ? 0 : 2,
              marginRight: isCollapsed ? 0 : 2,
              justifyContent: isCollapsed ? 'center' : 'initial',
              px: 1.5,
              borderRadius: '8px',
              color: 'red',
              paddingLeft: isCollapsed ? 1.5 : '24px',
              '&:hover': {
                backgroundColor: '#f0f4ff',
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isCollapsed ? 'none' : 1.5,
                justifyContent: 'center',
                color: 'red',
                fontSize: 18,
              }}
            >
              <CiPower />
            </ListItemIcon>
            {!isCollapsed && (
              <ListItemText primary={'Déconnexion'} primaryTypographyProps={{ fontSize: 14 }} />
            )}
          </ListItemButton>
        </Box>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant='permanent'
        sx={{
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          flexShrink: 0,
          height: '100vh',
          '& .MuiDrawer-paper': {
            width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.2s ease-in-out',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
          transition: 'width 0.2s ease-in-out',
        }}
      >
        <AppBar
          position='fixed'
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: '#fff',
            boxShadow: 'none',
            left: isCollapsed ? collapsedDrawerWidth : drawerWidth,
            width: `calc(100% - ${isCollapsed ? collapsedDrawerWidth : drawerWidth}px)`,
          }}
        >
          <Toolbar>
            {!isCollapsed && (
              <IconButton
                color='inherit'
                aria-label='toggle drawer'
                edge='start'
                onClick={handleDrawerToggle}
                sx={{
                  mr: 2,
                  color: '#4780ff',
                  borderRadius: '10px',
                  '&:hover': {
                    color: '#4780ff',
                  },
                }}
              >
                {isCollapsed ? <RiMenu4Fill /> : <RiMenuFill />}
              </IconButton>
            )}
          </Toolbar>
        </AppBar>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
