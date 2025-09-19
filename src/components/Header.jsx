import React, { useState } from "react";
import { AppBar, Toolbar, Typography, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import useAuthCookie from "../hooks/useAuthCookie";

const Header = ({ drawerWidth }) => {
  const { accountName } = useAuthCookie();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/v1/account/logout", {  
        method: "POST",
        credentials: "include", 
      });
      localStorage.removeItem("account");
      localStorage.removeItem("accountId");
      localStorage.removeItem("accountName");
      localStorage.removeItem("auth");

      window.location.href = "/login";
    } catch (err) {
      console.error("Lỗi logout:", err);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        backgroundColor: "#fff",
        color: "#000",
        boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">DASH BOARD ADMIN</Typography>
        <div>
          <IconButton color="inherit">
            <MailIcon />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar
              sx={{ width: 32, height: 32, cursor: "pointer" }}
              onClick={handleMenuOpen}
            >
              {accountName ? accountName.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography
              variant="body1"
              onClick={handleMenuOpen}
              style={{ cursor: "pointer" }}
            >
              {accountName}
            </Typography>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleLogout}>Đăng xuất</MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;