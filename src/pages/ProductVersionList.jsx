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

// Danh sách dữ liệu có sẵn
const memoryOptions = [
  "64GB",
  "128GB",
  "256GB",
  "512GB",
  "1TB",
];

const colorOptions = [
  "Space Gray",
  "Silver",
  "Gold",
  "Midnight",
  "Starlight",
  "Deep Purple",
  "Blue",
  "Black",
  "White",
  "Red",
];

const imageOptions = [
  "https://images.unsplash.com/photo-1592286927505-1def25115558?w=500&q=80",
  "https://images.unsplash.com/photo-1511707267537-b85faf00021e?w=500&q=80",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80",
  "https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=500&q=80",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80",
];

export default function ProductVersionList() {
  const [productVersions, setProductVersions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loadingDialog, setLoadingDialog] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const [formData, setFormData] = useState({
    memory: "",
    color: "",
    image1: "",
    productID: "",
  });

  const fetchProductVersions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/version/Listgetall`);
      setProductVersions(res.data);
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
    fetchProductVersions();
  }, []);

  const totalPages = Math.ceil(productVersions.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = productVersions.slice(startIndex, endIndex);

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
      memory: "",
      color: "",
      image1: "",
      productID: "",
    });
    setOpenDialog(true);
  };

  const handleOpenEdit = async (version) => {
    setEditingId(version.versionID);
    setOpenDialog(true);
    setLoadingDialog(true);

    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/v1/product/version/${version.versionID}`
      );
      
      setFormData({
        memory: res.data.memory,
        color: res.data.color,
        image1: res.data.image1,
        productID: res.data.productID,
      });
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      toast.error("Lỗi khi lấy dữ liệu phiên bản");
      setOpenDialog(false);
      setEditingId(null);
    } finally {
      setLoadingDialog(false);
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
    if (!formData.memory) {
      toast.error("Vui lòng chọn Memory!");
      return;
    }
    if (!formData.color) {
      toast.error("Vui lòng chọn Color!");
      return;
    }
    if (!formData.image1) {
      toast.error("Vui lòng chọn Image!");
      return;
    }
    if (!formData.productID || formData.productID <= 0) {
      toast.error("Vui lòng chọn Sản Phẩm!");
      return;
    }

    try {
      const dataToSend = {
        memory: formData.memory,
        color: formData.color,
        image1: formData.image1,
        productID: formData.productID,
      };

      if (editingId) {
        const response = await axios.put(
          `${API_BASE_URL}/api/v1/product/version/${editingId}/update`,
          dataToSend
        );
        if (response.status === 200) {
          toast.success("Cập nhật thành công!");
        }
      } else {
        const response = await axios.post(
          `${API_BASE_URL}/api/v1/product/version/create`,
          dataToSend
        );
        if (response.status === 201) {
          toast.success("Thêm thành công!");
        }
      }

      handleCloseDialog();
      fetchProductVersions();
    } catch (err) {
      console.error("Lỗi khi lưu:", err);
      const errorMsg = err.response?.data || err.message || "Lỗi khi lưu dữ liệu";
      toast.error(errorMsg);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa?")) {
      try {
        const response = await axios.delete(
          `${API_BASE_URL}/api/v1/product/version/${id}/delete`
        );
        if (response.status === 200) {
          toast.success("Xóa thành công!");
          fetchProductVersions();
        }
      } catch (err) {
        console.error("Lỗi khi xóa:", err);
        const errorMsg = err.response?.data || err.message || "Lỗi khi xóa";
        toast.error(errorMsg);
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
        DANH SÁCH PHIÊN BẢN SẢN PHẨM
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
          Thêm Phiên Bản Sản Phẩm
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
          Tổng: {productVersions.length} | Trang: {page}/{totalPages}
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
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Memory</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Color</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white" }}>Product ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length > 0 ? (
                  paginatedData.map((version) => (
                    <TableRow
                      key={version.versionID}
                      hover
                      sx={{
                        "&:hover": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell>{version.versionID}</TableCell>
                      <TableCell>{version.memory}</TableCell>
                      <TableCell>{version.color}</TableCell>
                      <TableCell>
                        <a href={version.image1} target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>
                          Xem ảnh
                        </a>
                      </TableCell>
                      <TableCell>{version.productID}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", justifyContent: "center" }}>
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<EditIcon />}
                            onClick={() => handleOpenEdit(version)}
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
                            onClick={() => handleDelete(version.versionID)}
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
                    <TableCell colSpan={6} align="center" sx={{ py: 4, color: "#999" }}>
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
          {editingId ? "Chỉnh Sửa Phiên Bản Sản Phẩm" : "Thêm Phiên Bản Sản Phẩm Mới"}
        </DialogTitle>

        <DialogContent sx={{ pt: 4, pb: 3, px: 3 }}>
          {loadingDialog && editingId ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ fontWeight: 600 }}>Memory</InputLabel>
                <Select
                  name="memory"
                  value={formData.memory}
                  onChange={handleChange}
                  label="Memory"
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
                    <em>-- Chọn Memory --</em>
                  </MenuItem>
                  {memoryOptions.map((memory) => (
                    <MenuItem key={memory} value={memory}>
                      {memory}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ fontWeight: 600 }}>Color</InputLabel>
                <Select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  label="Color"
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
                    <em>-- Chọn Color --</em>
                  </MenuItem>
                  {colorOptions.map((color) => (
                    <MenuItem key={color} value={color}>
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ fontWeight: 600 }}>Image</InputLabel>
                <Select
                  name="image1"
                  value={formData.image1}
                  onChange={handleChange}
                  label="Image"
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
                    <em>-- Chọn Ảnh --</em>
                  </MenuItem>
                  {imageOptions.map((image, idx) => (
                    <MenuItem key={idx} value={image}>
                      Ảnh {idx + 1}
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
            </>
          )}
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
            disabled={loadingDialog && editingId}
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