import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Collapse,
} from "@mui/material";
import {
  MdEditNote,
  MdOutlineCheckroom,
  MdDashboardCustomize,
  MdAccountCircle,
  MdOutlineLocalShipping,
  MdListAlt,
} from "react-icons/md";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import InventoryIcon from "@mui/icons-material/Inventory";
import CategoryIcon from "@mui/icons-material/Category";
import BarChartIcon from "@mui/icons-material/BarChart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import InfoIcon from "@mui/icons-material/Info";
import BuildIcon from "@mui/icons-material/Build";
import { CiDiscount1 } from "react-icons/ci";
import { Link } from "react-router-dom";

const Sidebar = ({ onToggle }) => {
  const [role, setRole] = useState("null");
  const [open, setOpen] = useState(true);
  const [openProductMenu, setOpenProductMenu] = useState(false);
  const drawerWidth = open ? 240 : 70;

  const toggleMenu = () => {
    setOpen(!open);
    onToggle(!open);
  };

  const toggleProductMenu = () => {
    setOpenProductMenu(!openProductMenu);
  };

  useEffect(() => {
    const accountData = localStorage.getItem("account");
    if (accountData) {
      try {
        const parsed = JSON.parse(accountData);
        const userRole = parsed.typeAccount || parsed.role || "USER";
        setRole(userRole);
      } catch (err) {
        console.error("Error parsing account data:", err);
        setRole("USER");
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
        {role === "ADMIN" && (
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon sx={{ color: "white" }}>
              <MdDashboardCustomize size={22} />
            </ListItemIcon>
            {open && <ListItemText primary="TRANG TỔNG QUAN" />}
          </ListItem>
        )}

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
        
        {/* === MENU CON: QUẢN LÝ SẢN PHẨM === */}
        <ListItem
          button
          onClick={toggleProductMenu}
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <InventoryIcon />
          </ListItemIcon>
          {open && (
            <>
              <ListItemText primary="QUẢN LÝ SẢN PHẨM" />
              {openProductMenu ? <ExpandLess /> : <ExpandMore />}
            </>
          )}
        </ListItem>

        {/* Menu con 1: Danh sách sản phẩm */}
        <Collapse in={openProductMenu} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem
              button
              component={Link}
              to="/products"
              sx={{
                pl: open ? 4 : 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: open ? 40 : 56 }}>
                <FormatListBulletedIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Danh sách sản phẩm" />}
            </ListItem>

            {/* Menu con 2: Danh sách Chi tiết SP */}
            <ListItem
              button
              component={Link}
              to="/product-details"
              sx={{
                pl: open ? 4 : 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: open ? 40 : 56 }}>
                <InfoIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Chi tiết sản phẩm" />}
            </ListItem>

            {/* Menu con 3: Danh sách Phiên bản SP */}
            <ListItem
              button
              component={Link}
              to="/product-versions"
              sx={{
                pl: open ? 4 : 2,
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: open ? 40 : 56 }}>
                <BuildIcon />
              </ListItemIcon>
              {open && <ListItemText primary="Phiên bản sản phẩm" />}
            </ListItem>
          </List>
        </Collapse>

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

        {/* ADMIN ONLY menu */}
        {role === "ADMIN" && (
          <ListItem button component={Link} to="/logs">
            <ListItemIcon sx={{ color: "white" }}>
              <MdListAlt size={22} />
            </ListItemIcon>
            {open && <ListItemText primary="QUẢN LÝ LOGS" />}
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

export default Sidebar;