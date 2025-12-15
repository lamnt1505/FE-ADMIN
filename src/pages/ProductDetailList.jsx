import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import API_BASE_URL from "../config/config.js";

export default function ProductDetailList() {
  const [productDetails, setProductDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Pagination states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    productDetailID: null,
    productCamera: "",
    productWifi: "",
    productScreen: "",
    productBluetooth: "",
    productID: "",
  });

  const cameraOptions = [
    "Camera chính 48MP",
    "Camera chính 64MP",
    "Camera chính 108MP",
    "Camera chính 200MP",
  ];

  const wifiOptions = [
    "Ultra Wide 12MP",
    "Ultra Wide 16MP",
    "Ultra Wide 20MP",
  ];

  const screenOptions = [
    "6.1 inch OLED",
    "6.5 inch OLED",
    "6.7 inch Super Retina XDR",
    "6.8 inch Dynamic AMOLED",
  ];

  const bluetoothOptions = [
    "Bluetooth 5.0",
    "Bluetooth 5.1",
    "Bluetooth 5.2",
    "Bluetooth 5.3",
  ];

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/productdetail/getall`);
      setProductDetails(res.data);
      setPage(1); 
      const productsRes = await axios.get(`${API_BASE_URL}/api/v1/product/getall`);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách:", err);
      toast.error("Lỗi khi lấy danh sách");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const totalPages = Math.ceil(productDetails.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = productDetails.slice(startIndex, endIndex);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      productDetailID: null,
      productCamera: "",
      productWifi: "",
      productScreen: "",
      productBluetooth: "",
      productID: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = async (detail) => {
    setEditingId(detail.productDetailID);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/productdetail/${detail.productDetailID}`
      );
      setFormData({
        productDetailID: res.data.productDetailID,
        productCamera: res.data.productCamera,
        productWifi: res.data.productWifi,
        productScreen: res.data.productScreen,
        productBluetooth: res.data.productBluetooth,
        productID: res.data.productID,
      });
      setOpenDialog(true);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      toast.error("Lỗi khi lấy dữ liệu chi tiết");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingId(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = name === "productID" ? Number(value) : value;
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleSave = async () => {
    if (!formData.productCamera) {
      toast.error("Vui lòng chọn Camera!");
      return;
    }
    if (!formData.productWifi) {
      toast.error("Vui lòng chọn WiFi!");
      return;
    }
    if (!formData.productScreen) {
      toast.error("Vui lòng chọn Màn Hình!");
      return;
    }
    if (!formData.productBluetooth) {
      toast.error("Vui lòng chọn Bluetooth!");
      return;
    }
    if (!formData.productID || formData.productID === "") {
      toast.error("Vui lòng chọn Sản Phẩm!");
      return;
    }

    try {
      const dataToSend = {
        productDetailID: null,
        productCamera: formData.productCamera,
        productWifi: formData.productWifi,
        productScreen: formData.productScreen,
        productBluetooth: formData.productBluetooth,
        productID: Number(formData.productID),
      };

      if (editingId) {
        await axios.put(
          `${API_BASE_URL}/api/v1/productdetail/${editingId}/update`,
          dataToSend
        );
        toast.success("Cập nhật thành công!");
      } else {
        await axios.post(
          `${API_BASE_URL}/api/v1/productdetail/add`,
          dataToSend
        );
        toast.success("Thêm thành công!");
      }

      handleCloseDialog();
      fetchProductDetails();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Lỗi khi lưu dữ liệu";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/v1/productdetail/${id}`);
        fetchProductDetails();
        toast.success("Xóa thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        toast.error("Lỗi khi xóa");
      }
    }
  };

  return (
    <Box sx={{ p: 3, mt: 10, background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)", minHeight: "100vh" }}>
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
        DANH SÁCH CHI TIẾT SẢN PHẨM
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAdd}
          sx={{
            backgroundColor: "#1976d2",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
        >
          Thêm Chi Tiết Sản Phẩm
        </Button>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Hiển thị</InputLabel>
          <Select
            value={pageSize}
            onChange={handlePageSizeChange}
            label="Hiển thị"
          >
            <MenuItem value={5}>5 trên trang</MenuItem>
            <MenuItem value={10}>10 trên trang</MenuItem>
            <MenuItem value={15}>15 trên trang</MenuItem>
            <MenuItem value={20}>20 trên trang</MenuItem>
          </Select>
        </FormControl>
        <Typography sx={{ ml: "auto" }}>
          Tổng: {productDetails.length} | Trang: {page}/{totalPages}
        </Typography>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#2563eb" }}>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Camera</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>WiFi</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Màn Hình</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Bluetooth</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Product ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((detail) => (
                    <TableRow
                      key={detail.productDetailID}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>{detail.productDetailID}</TableCell>
                      <TableCell>{detail.productCamera}</TableCell>
                      <TableCell>{detail.productWifi}</TableCell>
                      <TableCell>{detail.productScreen}</TableCell>
                      <TableCell>{detail.productBluetooth}</TableCell>
                      <TableCell>{detail.productID}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenEdit(detail)}
                            sx={{
                              mr: 1,
                              color: "#2196F3",
                              borderColor: "#2196F3",
                              "&:hover": { backgroundColor: "#E3F2FD" },
                            }}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            color="error"
                            onClick={() => handleDelete(detail.productDetailID)}
                            sx={{ "&:hover": { backgroundColor: "#FFEBEE" } }}
                          >
                            Xóa
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: "#999" }}>
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              showFirstButton
              showLastButton
            />
          </Box>
        </>
      )}

      {/* Dialog Thêm/Sửa */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "20px",
            backgroundColor: editingId ? "#e3f2fd" : "#f0f7ff",
            borderBottom: "3px solid #1976d2",
            color: "#1976d2",
            p: 3,
          }}
        >
          {editingId ? "Chỉnh Sửa Chi Tiết Sản Phẩm" : "Thêm Chi Tiết Sản Phẩm Mới"}
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ fontWeight: 600 }}>Camera</InputLabel>
            <Select
              name="productCamera"
              value={formData.productCamera}
              onChange={handleChange}
              label="Camera"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>-- Chọn Camera --</em>
              </MenuItem>
              {cameraOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ fontWeight: 600 }}>WiFi / Ultra Wide</InputLabel>
            <Select
              name="productWifi"
              value={formData.productWifi}
              onChange={handleChange}
              label="WiFi / Ultra Wide"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>-- Chọn WiFi --</em>
              </MenuItem>
              {wifiOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ fontWeight: 600 }}>Màn Hình</InputLabel>
            <Select
              name="productScreen"
              value={formData.productScreen}
              onChange={handleChange}
              label="Màn Hình"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>-- Chọn Màn Hình --</em>
              </MenuItem>
              {screenOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel sx={{ fontWeight: 600 }}>Bluetooth</InputLabel>
            <Select
              name="productBluetooth"
              value={formData.productBluetooth}
              onChange={handleChange}
              label="Bluetooth"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>-- Chọn Bluetooth --</em>
              </MenuItem>
              {bluetoothOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel sx={{ fontWeight: 600 }}>Sản Phẩm</InputLabel>
            <Select
              name="productID"
              value={formData.productID}
              onChange={handleChange}
              label="Sản Phẩm"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover fieldset": {
                    borderColor: "#1976d2",
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>-- Chọn Sản Phẩm --</em>
              </MenuItem>
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  <span style={{ fontWeight: 500 }}>{product.name}</span>
                  <span style={{ marginLeft: 8, color: "#999", fontSize: "0.85em" }}>
                    (ID: {product.id})
                  </span>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            backgroundColor: "#f9fafb",
            borderTop: "1px solid #e0e0e0",
            gap: 2,
          }}
        >
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            sx={{
              color: "#666",
              borderColor: "#d0d0d0",
              borderRadius: 2,
              fontWeight: 600,
              px: 3,
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#999",
              },
            }}
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: editingId ? "#2196F3" : "#4CAF50",
              borderRadius: 2,
              fontWeight: 600,
              px: 4,
              textTransform: "uppercase",
              fontSize: "0.9em",
              boxShadow: "0 4px 12px rgba(76, 175, 80, 0.3)",
              "&:hover": {
                backgroundColor: editingId ? "#1976D2" : "#45a049",
                boxShadow: "0 6px 16px rgba(76, 175, 80, 0.4)",
              },
            }}
          >
            {editingId ? "Cập Nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
}