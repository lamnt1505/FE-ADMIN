import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify"; // ✅ import
import "react-toastify/dist/ReactToastify.css";

const StorageForm = () => {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    productId: "",
    quantity: 0,
    createDate: "",
    updateDate: "",
    users: "admin", // ✅ trùng với BE
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/product/Listgetall");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi load sản phẩm:", err);
      toast.error("❌ Lỗi khi load danh sách sản phẩm!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form, [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("📦 Dữ liệu gửi lên BE:", form);

    if (!form.productId) {
      toast.warning("⚠️ Vui lòng chọn sản phẩm!");
      return;
    }
    try {
      await axios.post("http://localhost:8080/api/v1/storage/add", form, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("🎉 Thêm lưu trữ thành công! Đang chuyển hướng...", {
        autoClose: 3000,
      });

      setTimeout(() => {
        window.location.href = "/StorageList";
      }, 4000);
    } catch (err) {
      console.error("Lỗi khi thêm:", err);
    }
  };

  return (
    <Box
      sx={{
        ml: "240px",
        mt: "64px",
        p: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" gutterBottom align="center">
          Thêm Lưu Trữ Kho Hàng Sản Phẩm
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Chọn sản phẩm */}
          <TextField
              select
              fullWidth
              label="Tên Sản Phẩm"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              margin="normal"
              required
          >
  {products.map((p) => (
    <MenuItem key={p.id} value={p.id}>
      {p.name}
    </MenuItem>
  ))}
</TextField>
          {/* Số lượng */}
          <TextField
            fullWidth
            label="Số Lượng"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            margin="normal"
            required
          />

          {/* Ngày nhập */}
          <TextField  
            fullWidth
            label="Ngày Nhập"
            name="createDate"
            type="date"
            value={form.createDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          {/* Ngày xuất */}
          <TextField
            fullWidth
            label="Ngày Xuất"
            name="updateDate"
            type="date"
            value={form.updateDate}
            onChange={handleChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />

          {/* Người quản lý */}
          <TextField
            fullWidth
            label="Người Quản Lý"
            name="users"
            value={form.users}
            margin="normal"
            disabled
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            fullWidth
          >
            Thêm Lưu Trữ
          </Button>
        </form>
      </Paper>
      <ToastContainer position="top-center" />
    </Box>
  );
};

export default StorageForm;
