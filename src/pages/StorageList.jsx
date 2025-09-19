import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem
} from "@mui/material";

const StorageList = () => {
  const [storages, setStorages] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState(null);
  const [form, setForm] = useState({
    productId: "",
    quantity: 0,
    createDate: "",
    updateDate: "",
    users: "admin",
  });

  useEffect(() => {
    fetchStorages();
    fetchProducts();
  }, []);

  const fetchStorages = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/storage/Listgetall");
      setStorages(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/v1/product/Listgetall");
      setProducts(res.data);
    } catch (err) {
      console.error("Lỗi khi load sản phẩm:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa bản ghi này?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/v1/storage/delete/${id}`);
      setStorages(storages.filter((s) => s.idImport !== id));
    } catch (err) {
      console.error("Lỗi khi xóa:", err);
    }
  };

  // Mở dialog cập nhật
  const handleOpenUpdate = (storage) => {
    setSelectedStorage(storage);
    setForm({
      productId: storage.product_id || "",
      quantity: storage.quantity || 0,
      createDate: storage.createDate || "",
      updateDate: storage.updateDate || "",
      users: storage.users || "admin",
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStorage(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "quantity" ? Number(value) : value,
    });
  };

  const handleUpdate = async () => {
    if (!selectedStorage) return;
    try {
      await axios.put(`http://localhost:8080/api/v1/storage/update/${selectedStorage.idImport}`, form, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Cập nhật thành công!");
      handleClose();
      fetchStorages(); // refresh danh sách
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
    }
  };

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Danh Sách Kho Hàng
      </Typography>

      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => (window.location.href = "/add-storage")}
      >
        + Thêm Nhập Kho
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Người nhập</TableCell>
              <TableCell>Sản phẩm</TableCell>
              <TableCell>Số lượng</TableCell>
              <TableCell>Ngày nhập</TableCell>
              <TableCell>Ngày cập nhật</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storages.map((s) => (
              <TableRow key={s.idImport}>
                <TableCell>{s.idImport}</TableCell>
                <TableCell>{s.users}</TableCell>
                <TableCell>{s.product_name}</TableCell>
                <TableCell>{s.quantity}</TableCell>
                <TableCell>{s.createDate}</TableCell>
                <TableCell>{s.updateDate}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="info"
                    size="small"
                    sx={{ mr: 1 }}
                  >
                    Chi tiết
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleOpenUpdate(s)}
                  >
                    Cập nhật
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => handleDelete(s.idImport)}
                  >
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog Update */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cập Nhật Kho Hàng</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Sản phẩm"
            name="productId"
            value={form.productId}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {products.map((p) => (
              <MenuItem key={p.id} value={p.id}>
                {p.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Số lượng"
            name="quantity"
            type="number"
            value={form.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Ngày nhập"
            name="createDate"
            type="date"
            value={form.createDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Ngày cập nhật"
            name="updateDate"
            type="date"
            value={form.updateDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Người nhập"
            name="users"
            value={form.users}
            disabled
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Đóng</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StorageList;