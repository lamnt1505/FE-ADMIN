import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import {
  MdEditNote,
  MdOutlineCheckroom,
  MdDashboardCustomize,
  MdAccountCircle,
  MdOutlineLocalShipping,
} from "react-icons/md";
import { CiDiscount1 } from "react-icons/ci";
import { Link } from "react-router-dom";

const Sidebar = ({ onToggle  }) => {
  const [role, setRole] = useState("null");
  const [open, setOpen] = useState(true);
  const drawerWidth = open ? 240 : 70;
    const toggleMenu = () => {
    setOpen(!open);
    onToggle(!open);
  };

  useEffect(() => {
    const accountData = localStorage.getItem("account");
    if (accountData) {
      try {
        const parsed = JSON.parse(accountData);
        setRole(parsed.typeAccount || parsed.role || "ADMIN");
      } catch {
        setRole("ADMIN");
      }
    }
  }, []);

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: drawerWidth,
        transition: "0.3s",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          backgroundColor: "#2563EB",
          color: "white",
          transition: "0.3s",
          overflowX: "hidden",
        },
      }}
    >
      {/* Nút thu nhỏ mở rộng */}
      <IconButton
        onClick={toggleMenu}
        sx={{
          color: "white",
          m: 1,
        }}
      >
        {open ? <ChevronLeftIcon /> : <MenuIcon />}
      </IconButton>

      {open && (
        <Typography variant="h6" align="center" sx={{ my: 1 }}>
          TỔNG QUAN
        </Typography>
      )}

      <List>
        <ListItem button component={Link} to="/dashboard">
          <ListItemIcon sx={{ color: "white" }}>
            <MdDashboardCustomize size={22} />
          </ListItemIcon>
          {open && <ListItemText primary="TRANG TỔNG QUAN" />}
        </ListItem>

        <ListItem button component={Link} to="/storages">
          <ListItemIcon sx={{ color: "white" }}>
            <MdOutlineLocalShipping size={22} />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ LƯU TRỮ" />}
        </ListItem>

        <ListItem button component={Link} to="/accounts">
          <ListItemIcon sx={{ color: "white" }}>
            <MdAccountCircle size={22} />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ TÀI KHOẢN" />}
        </ListItem>

        <ListItem button component={Link} to="/products">
          <ListItemIcon sx={{ color: "white" }}>
            <InventoryIcon />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ SẢN PHẨM" />}
        </ListItem>

        <ListItem button component={Link} to="/categories">
          <ListItemIcon sx={{ color: "white" }}>
            <CategoryIcon />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ LOẠI SẢN PHẨM" />}
        </ListItem>

        <ListItem button component={Link} to="/trademarks">
          <ListItemIcon sx={{ color: "white" }}>
            <MdOutlineCheckroom size={22} />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ THƯƠNG HIỆU" />}
        </ListItem>

        <ListItem button component={Link} to="/statisticals">
          <ListItemIcon sx={{ color: "white" }}>
            <BarChartIcon />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ THỐNG KÊ" />}
        </ListItem>

        <ListItem button component={Link} to="/orders">
          <ListItemIcon sx={{ color: "white" }}>
            <ShoppingCartIcon />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ ĐƠN HÀNG" />}
        </ListItem>

        <ListItem button component={Link} to="/votes">
          <ListItemIcon sx={{ color: "white" }}>
            <MdEditNote size={22} />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ ĐÁNH GIÁ" />}
        </ListItem>

        <ListItem button component={Link} to="/discountslist">
          <ListItemIcon sx={{ color: "white" }}>
            <CiDiscount1 size={22} />
          </ListItemIcon>
          {open && <ListItemText primary="QUẢN LÝ MÃ GIẢM GIÁ" />}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;