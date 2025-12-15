import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  Table, TableBody, TableCell,
  MenuItem, TableContainer, TableHead,
  Select, TableRow, Paper,
  Typography, Avatar, Dialog,
  DialogTitle, DialogContent, DialogActions,
  TextField, FormControl, InputLabel, Box, Button,
  Pagination, Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/config.js";

const Products = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateId, setUpdateId] = useState(null);
  const [updateName, setUpdateName] = useState("");
  const [updatePrice, setUpdatePrice] = useState("");
  const [updateDescription, setUpdateDescription] = useState("");
  const [updateCategoryId, setUpdateCategoryId] = useState("");
  const [updateTrademarkId, setUpdateTrademarkId] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [updateImageFile, setUpdateImageFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [trademarks, setTrademarks] = useState([]);
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  
  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const handleOpenImage = (img) => {
    setSelectedImage(img);
    setOpenImage(true);
  };

  const handleCloseImage = () => {
    setOpenImage(false);
    setSelectedImage(null);
  };

  const handleOpenUpdate = async (id) => {
    try {
      const [productRes, categoryRes, trademarkRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/v1/product/${id}/get`),
        axios.get(`${API_BASE_URL}/api/v1/category/Listgetall`),
        axios.get(`${API_BASE_URL}/api/trademark/gettrademark`),
      ]);

      const product = productRes.data;
      const categories = categoryRes.data;
      const trademarks = trademarkRes.data;

      setUpdateId(id);
      setUpdateName(product.name || "");
      setUpdatePrice(product.price || "");
      setUpdateDescription(product.description || "");
      setUpdateDate(product.date_product || "");

      setUpdateCategoryId(product.categoryID ? String(product.categoryID) : "");
      setUpdateTrademarkId(product.tradeID ? String(product.tradeID) : "");

      setUpdateImageFile(null);

      setCategories(categories || []);
      setTrademarks(trademarks || []);

      setOpenUpdate(true);
    } catch (err) {
      toast.error("Không thể tải dữ liệu sản phẩm!");
    }
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
    setUpdateId(null);
    setUpdateName("");
  };

  const handleConfirmUpdate = async () => {
    try {
      let imageBase64 = null;
      if (updateImageFile) {
        imageBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(updateImageFile);
        });
      }

      const payload = {
        name: updateName,
        price: parseFloat(updatePrice),
        description: updateDescription,
        categoryID: updateCategoryId,
        tradeID: updateTrademarkId,
        date_product: updateDate,
        image: imageBase64,
      };

      await axios.put(
        `${API_BASE_URL}/api/v1/product/update/${updateId}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Cập nhật sản phẩm thành công!");
      handleCloseUpdate();
      fetchProducts(page - 1, pageSize);
    } catch (err) {
      console.error("Lỗi khi cập nhật:", err);
      if (err.response)
        toast.error(err.response.data?.error || "Cập nhật thất bại!");
      else toast.error("Không thể kết nối đến server!");
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/v1/product/import`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success(res.data.message || "Tải file thành công!");
      setPage(1);
      fetchProducts(0, pageSize);
    } catch (err) {
      console.error("Lỗi upload:", err);
      toast.error("Có lỗi khi tải file!");
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/${id}/get`);
      setSelectedProduct(res.data);
      setOpen(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
      toast.error("Không thể tải chi tiết sản phẩm!");
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
  };

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1/product/download`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "API-PRODUCT.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Tải file mẫu thành công!");
    } catch (error) {
      toast.error("Không thể tải file mẫu!");
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/v1/product/delete/${deleteId}`);
      toast.success("Xóa sản phẩm thành công!");
      handleCloseDelete();
      setPage(1);
      fetchProducts(0, pageSize);
    } catch (err) {
      console.error("Lỗi khi xóa sản phẩm:", err);
      toast.error("Có lỗi xảy ra khi xóa sản phẩm!");
    }
  };

  const fetchProducts = async (pageNum, pageSizeNum) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/paginated`, {
        params: { page: pageNum, size: pageSizeNum, sort: ["productID", "desc"] },
        withCredentials: true,
      });
      setProducts(res.data.content);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.totalElements);
    } catch (err) {
      toast.error("Không thể tải danh sách sản phẩm!");
    }
  };

  useEffect(() => {
    fetchProducts(page - 1, pageSize);
  }, [page, pageSize]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/v1/category/Listgetall`
        );
        setCategories(res.data);
      } catch (err) {
        toast.error("Không thể tải danh sách loại sản phẩm!");
      }
    };
    const fetchTrademarks = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/trademark/gettrademark`
        );
        setTrademarks(res.data);
      } catch (err) {
        console.error("Lỗi khi load trademarks:", err);
        toast.error("Không thể tải danh sách thương hiệu!");
      }
    };
    fetchCategories();
    fetchTrademarks();
  }, []);

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: "bold",
          color: "#1976d2",
          mb: 3,
          textTransform: "uppercase",
        }}
      >
        Danh sách sản phẩm
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          color="primary"
          onClick={() => navigate("/add-product")}
        >
          Thêm Sản Phẩm Mặc Định
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudDownloadIcon />}
          color="info"
          onClick={handleDownloadTemplate}
        >
          Tải File Mẫu
        </Button>
        <Button
          variant="contained"
          startIcon={<CloudUploadIcon />}
          color="success"
          onClick={handleButtonClick}
        >
          Tải Lên File Excel
        </Button>
        <input
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        {/* Page Size Selector */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Hiển thị</InputLabel>
          <Select
            value={pageSize}
            onChange={(e) => {
              setPageSize(e.target.value);
              setPage(1);
            }}
            label="Hiển thị"
          >
            <MenuItem value={5}>5 trên trang</MenuItem>
            <MenuItem value={10}>10 trên trang</MenuItem>
            <MenuItem value={15}>15 trên trang</MenuItem>
            <MenuItem value={20}>20 trên trang</MenuItem>
          </Select>
        </FormControl>

        {/* Total info */}
        <Typography sx={{ ml: "auto" }}>
          Tổng: {totalProducts} | Trang: {page}/{totalPages}
        </Typography>
      </Stack>

      <TableContainer
        component={Paper}
        sx={{ width: "100%", boxShadow: "none", borderRadius: 0 }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead sx={{ backgroundColor: "#2564eb" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                ẢNH
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                TÊN SẢN PHẨM
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                LOẠI
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                THƯƠNG HIỆU
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                GIÁ
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                NGÀY SẢN XUẤT
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                MÔ TẢ
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.2rem" }}>
                CHỨC NĂNG
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Avatar
                    variant="square"
                    src={
                      product.image
                        ? product.image
                        : product.imageBase64
                        ? `data:image/jpeg;base64,${product.imageBase64}`
                        : ""
                    }
                    alt={product.name}
                    sx={{ width: 80, height: 80, cursor: "pointer" }}
                    onClick={() => handleOpenImage(product.image)}
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.categoryname}</TableCell>
                <TableCell>{product.tradeName}</TableCell>
                <TableCell>{product.price?.toLocaleString()} VNĐ</TableCell>
                <TableCell>{product.date_product}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => handleOpenDetail(product.id)}
                    >
                      Chi tiết
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenUpdate(product.id)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleOpenDelete(product.id)}
                    >
                      Xóa
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" my={2}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
          size="large"
          showFirstButton
          showLastButton
        />
      </Box>

      {/* Dialogs - Chi tiết */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Chi tiết sản phẩm</DialogTitle>
        <DialogContent dividers>
          {selectedProduct ? (
            <>
              <Typography>
                <b>Tên sản phẩm:</b> {selectedProduct.name}
              </Typography>
              <Typography>
                <b>Loại:</b> {selectedProduct.categoryname}
              </Typography>
              <Typography>
                <b>Giá:</b> {selectedProduct.price?.toLocaleString()} VNĐ
              </Typography>
              <Typography>
                <b>Ngày sản xuất:</b> {selectedProduct.date_product}
              </Typography>
              <Typography>
                <b>Mô tả:</b> {selectedProduct.description}
              </Typography>
              <img
                src={
                  selectedProduct.image
                    ? selectedProduct.image
                    : selectedProduct.imageBase64
                    ? `data:image/jpeg;base64,${selectedProduct.imageBase64}`
                    : ""
                }
                alt={selectedProduct.name}
                style={{ width: "100%", marginTop: "10px" }}
              />
            </>
          ) : (
            <Typography>Đang tải...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="contained" color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Xóa */}
      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          Bạn có chắc chắn muốn xóa sản phẩm này không?
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} variant="outlined">
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
          >
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog - Xem ảnh */}
      <Dialog open={openImage} onClose={handleCloseImage} maxWidth="md">
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog - Cập nhật */}
      <Dialog
        open={openUpdate}
        onClose={handleCloseUpdate}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Cập nhật sản phẩm</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Tên sản phẩm"
            value={updateName}
            onChange={(e) => setUpdateName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Giá"
            type="number"
            value={updatePrice}
            onChange={(e) => setUpdatePrice(e.target.value)}
            fullWidth
          />
          <TextField
            label="Mô tả"
            multiline
            rows={3}
            value={updateDescription}
            onChange={(e) => setUpdateDescription(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="category-label">Loại sản phẩm</InputLabel>
            <Select
              labelId="category-label"
              value={updateCategoryId || ""}
              onChange={(e) => setUpdateCategoryId(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={String(cat.id)}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="trademark-label">Thương hiệu</InputLabel>
            <Select
              labelId="trademark-label"
              value={updateTrademarkId || ""}
              onChange={(e) => setUpdateTrademarkId(e.target.value)}
            >
              {trademarks.map((tr) => (
                <MenuItem key={tr.tradeID} value={String(tr.tradeID)}>
                  {tr.tradeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Ngày sản xuất"
            type="date"
            value={updateDate}
            onChange={(e) => setUpdateDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
          <Button variant="outlined" component="label">
            Chọn ảnh
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => setUpdateImageFile(e.target.files[0])}
            />
          </Button>
          {updateImageFile && (
            <Typography>Ảnh đã chọn: {updateImageFile.name}</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseUpdate}>Hủy</Button>
          <Button
            onClick={handleConfirmUpdate}
            variant="contained"
            color="primary"
          >
            Lưu thay đổi
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </Box>
  );
};

export default Products;