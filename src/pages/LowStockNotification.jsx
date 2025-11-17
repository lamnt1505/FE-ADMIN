import React, { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Close as CloseIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import API_BASE_URL from "../config/config.js";

const LowStockNotification = () => {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
    // Tự động refresh mỗi 5 phút
    const interval = setInterval(fetchLowStockProducts, 0.5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/storage/low-stock?threshold=5`);
      const data = await res.json();
      setLowStockProducts(data || []);
    } catch (err) {
      console.error("Lỗi khi lấy thông tin tồn kho:", err);
    }
  };

  if (lowStockProducts.length === 0) return null;

  return (
    <>
      {showBanner && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{
            mb: 2,
            borderRadius: 2,
            boxShadow: 2,
          }}
          action={
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                color="inherit"
                size="small"
                onClick={() => setShowDrawer(true)}
                sx={{ fontWeight: "bold" }}
              >
                XEM CHI TIẾT ({lowStockProducts.length})
              </Button>
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setShowBanner(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          }
        >
          <strong>⚠️ CẢNH BÁO TỒN KHO THẤP:</strong> Có{" "}
          <strong>{lowStockProducts.length}</strong> sản phẩm sắp hết hàng tại
          các chi nhánh!
        </Alert>
      )}

      {/* Icon floating button */}
      <IconButton
        onClick={() => setShowDrawer(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "warning.main",
          color: "white",
          width: 64,
          height: 64,
          boxShadow: 4,
          "&:hover": {
            bgcolor: "warning.dark",
            transform: "scale(1.1)",
          },
          transition: "all 0.3s",
          zIndex: 1000,
          animation: lowStockProducts.length > 0 ? "pulse 2s infinite" : "none",
          "@keyframes pulse": {
            "0%": { boxShadow: "0 0 0 0 rgba(255, 152, 0, 0.7)" },
            "70%": { boxShadow: "0 0 0 10px rgba(255, 152, 0, 0)" },
            "100%": { boxShadow: "0 0 0 0 rgba(255, 152, 0, 0)" },
          },
        }}
      >
        <Badge badgeContent={lowStockProducts.length} color="error">
          <InventoryIcon fontSize="large" />
        </Badge>
      </IconButton>

      {/* Drawer hiển thị danh sách */}
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: { width: 450, p: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <WarningIcon color="warning" sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h5" fontWeight="bold" sx={{ flex: 1 }}>
            SẢN PHẨM SẮP HẾT
          </Typography>
          <IconButton onClick={() => setShowDrawer(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <List sx={{ maxHeight: "calc(100vh - 250px)", overflow: "auto" }}>
          {lowStockProducts.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 2,
                  mb: 1,
                  border: "1px solid",
                  borderColor: "divider",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <Box sx={{ width: "100%", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.product_name}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Tồn kho:
                  </Typography>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color={item.quantity <= 2 ? "error.main" : "warning.main"}
                  >
                    {item.quantity} sản phẩm
                  </Typography>
                </Box>

                {item.quantity <= 2 && (
                  <Alert severity="error" sx={{ mt: 1, width: "100%" }}>
                    🚨 GẤP: Số lượng rất thấp!
                  </Alert>
                )}
              </ListItem>
            </React.Fragment>
          ))}
        </List>

        <Box sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => {
              setShowDrawer(false);
              window.location.href = "/storages";
            }}
          >
            ĐI ĐẾN QUẢN LÝ TỒN KHO
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default LowStockNotification;