import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const drawerWidth = 240;

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Sidebar drawerWidth={drawerWidth} />
      <Box sx={{ flexGrow: 1, bgcolor: '#f8f9fa', minHeight: '100vh' }}>
        <Header drawerWidth={drawerWidth} />
        <Box component="main" sx={{ p: 0, minHeight: 'calc(100vh - 64px)' }}>
          {/* Nơi React Router render route con */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;