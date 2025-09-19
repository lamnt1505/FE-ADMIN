import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";

export default function AddProduct() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date_product: "",
    price: "",
    categoryID: "",
    tradeID: "",
  });

  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trademarks, setTrademarks] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/category/Listgetall")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Lỗi load categories:", err));

    axios.get("http://localhost:8080/api/trademark/gettrademark")
      .then((res) => {
        console.log("Trademarks API:", res.data);
        setTrademarks(res.data);
      })
      .catch((err) => console.error("Lỗi load trademarks:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (image) {
      data.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/product/add",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("🎉 Thêm sản phẩm thành công! Sẽ chuyển hướng sau 10 giây...", {
        position: "top-center",
        autoClose: 3000,
      });
      console.log(res.data);

      setTimeout(() => {
        navigate("/products");
      }, 10000);
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);
      alert("Thêm sản phẩm thất bại!");
    }
  };

  return (
    <Box sx={{
    flexGrow: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "calc(100vh - 64px)",
    p: 2,
  }}>
      <Box
    sx={{
      p: 4,
      maxWidth: 600,
      width: "100%",
      backgroundColor: "#fff",
      borderRadius: 2,
      boxShadow: 3,
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}>
        <Box
      sx={{
        p: 4,
        maxWidth: 600,
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 2,
        boxShadow: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    ></Box>
        <Typography variant="h5" mb={2} textAlign="center">
          Thêm Sản Phẩm Mặc Định
        </Typography>

        <TextField
          label="Tên Sản Phẩm"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
        />

        <Button variant="outlined" component="label">
          Chọn Ảnh
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        <TextField
          label="Mô Tả"
          name="description"
          value={formData.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <TextField
          label="Ngày Sản Xuất"
          name="date_product"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.date_product}
          onChange={handleChange}
        />

        <TextField
          label="Giá"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
        />

        <TextField
          label="Loại Sản Phẩm"
          name="categoryID"
          select
          value={formData.categoryID}
          onChange={handleChange}
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Thương Hiệu"
          name="tradeID"
          select
          value={formData.tradeID}
          onChange={handleChange}
        >
          {trademarks.map((t) => (
            <MenuItem key={t.tradeID} value={t.tradeID}>
              {t.tradeName}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" color="primary" onClick={handleSubmit}>
          THÊM MỚI
        </Button>
        <Button variant="contained" color="inherit" onClick={() => navigate("/products")}>
          QUAY VỀ DANH SÁCH SẢN PHẨM
        </Button>
      </Box>
      <ToastContainer />
    </Box>
  );
}
