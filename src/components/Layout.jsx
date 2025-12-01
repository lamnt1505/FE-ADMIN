import React, { useState } from "react";
import Sidebar from './Sidebar';
import Header from './Header';
import LowStockNotification from '../pages/LowStockNotification';
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const drawerWidth = sidebarOpen ? 240 : 70;

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <Sidebar onToggle={setSidebarOpen} />

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "#f8f9fa",
          minHeight: "100vh",
          ml: 0,
          transition: "0.3s",
        }}
      >
        <Header drawerWidth={drawerWidth} />

        <Box component="main" sx={{ p: 0, minHeight: "calc(100vh - 64px)" }}>
          <LowStockNotification />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;