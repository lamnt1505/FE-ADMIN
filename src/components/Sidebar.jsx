import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import CategoryIcon from '@mui/icons-material/Category';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { MdEditNote } from "react-icons/md";
import { MdDialerSip } from "react-icons/md";
import { MdOutlineCheckroom } from "react-icons/md";
import { MdDashboardCustomize } from "react-icons/md";
import { MdAccountCircle } from "react-icons/md";
import { MdOutlineLocalShipping } from "react-icons/md";
import { Link } from 'react-router-dom';

const Sidebar = ({ drawerWidth }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#2563EB',
          color: 'white'
        }
      }}
    >
      <Typography variant="h6" align="center" sx={{ my: 2 }}>
        TỔNG QUAN
      </Typography>
      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon sx={{ color: 'white' }}><MdDashboardCustomize /></ListItemIcon>
          <ListItemText primary="TRANG TỔNG QUAN" />
        </ListItem>
        <ListItem button component={Link} to="/storages">
          <ListItemIcon sx={{ color: 'white' }}><MdOutlineLocalShipping /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ LƯU TRỮ" />
        </ListItem>
        <ListItem button component={Link} to="/accounts">
          <ListItemIcon sx={{ color: 'white' }}><MdAccountCircle /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ TÀI KHOẢN" />
        </ListItem>
        <ListItem button component={Link} to="/products">
          <ListItemIcon sx={{ color: 'white' }}><InventoryIcon /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ SẢN PHẨM" />
        </ListItem>
        <ListItem button component={Link} to="/categories">
          <ListItemIcon sx={{ color: 'white' }}><CategoryIcon /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ LOẠI SẢN PHẨM" />
        </ListItem>
        <ListItem button component={Link} to="/trademarks">
          <ListItemIcon sx={{ color: 'white' }}><MdOutlineCheckroom /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ THƯƠNG HIỆU" />
        </ListItem>
        <ListItem button component={Link} to="/statisticals">
          <ListItemIcon sx={{ color: 'white' }} ><BarChartIcon /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ THỐNG KÊ" />
        </ListItem>
        <ListItem button component={Link} to="/orders">
          <ListItemIcon sx={{ color: 'white' }}><ShoppingCartIcon /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ GIỎ HÀNG" />
        </ListItem>
        <ListItem button component={Link} to="/votes">
          <ListItemIcon sx={{ color: 'white' }}><MdEditNote /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ ĐÁNH GIÁ" />
        </ListItem>
         <ListItem button component={Link} to="/discounts">
          <ListItemIcon sx={{ color: 'white' }}><MdDialerSip /></ListItemIcon>
          <ListItemText primary="QUẢN LÝ MÃ GIẢM GIÁ" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
