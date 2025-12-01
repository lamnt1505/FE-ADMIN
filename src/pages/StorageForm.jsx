import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select } from "@mui/material";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/config.js";

const StorageForm = () => {
  const [products, setProducts] = useState([]);
 
  const accountData = JSON.parse(localStorage.getItem("account"));
  
  const currentUser = localStorage.getItem("accountName") || "admin";


  const [form, setForm] = useState({
    productId: "",
    quantity: 0,
    createDate: "",
    updateDate: "",
    users: "",
  });

  useEffect(() => {
    fetchProducts();
    setForm((prev) => ({
      ...prev,
      users: currentUser,
    }));
  }, [currentUser]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/Listgetall`);
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi load sản phẩm:", err);
      toast.error("❌ Lỗi khi load danh sách sản phẩm!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.productId) {
      toast.warning("⚠️ Vui lòng chọn sản phẩm!");
      return;
    }
    
    if (form.quantity <= 0) {
      toast.warning("⚠️ Số lượng phải lớn hơn 0!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/v1/storage/add`, form, {
        headers: { "Content-Type": "application/json" },
      });
      
      toast.success(`✅ Thêm lưu trữ thành công! (Người tạo: ${currentUser})`, {
        autoClose: 3000,
      });

      setTimeout(() => {
        window.location.href = "/storages";
      }, 4000);
    } catch (err) {
      console.error("Lỗi khi thêm:", err);
      toast.error("❌ Lỗi khi thêm lưu trữ!");
    }
  };

  return (
    <Box
      sx={{
        pl: "240px",
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
        <Typography
          sx={{
            fontWeight: "bold",
            color: "#1976d2",
            mb: 3,
            textTransform: "uppercase",
          }}
        >
          Thêm Phiếu Lưu Kho
        </Typography>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="product-label">Tên Sản Phẩm</InputLabel>

            <Select
              labelId="product-label"
              name="productId"
              value={form.productId}
              label="Tên Sản Phẩm"
              onChange={handleChange}
              required
            >
              {products.map((p) => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Số Lượng"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ min: 1 }}
          />
          
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
          
          <TextField
            fullWidth
            label="Người Quản Lý"
            name="users"
            value={form.users}
            margin="normal"
            disabled
            helperText={`Đăng nhập bằng: ${currentUser}`}
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