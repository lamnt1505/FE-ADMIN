import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderSummaryPage = () => {
  const [orders, setOrders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [orderDetails, setOrderDetails] = useState([]);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openAddressDialog, setOpenAddressDialog] = useState(false);
  const [addressInfo, setAddressInfo] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      console.log("⏳ Kiểm tra và cập nhật trạng thái đơn hàng tự động...");
      try {
        const res = await axios.get(
          "http://localhost:8080/dossier-statistic/summary"
        );
        const currentOrders = res.data;

        currentOrders.forEach(async (order) => {
          if (order.status === "Hoàn thành" || order.status === "Đã huỷ") {
            console.log(`⏭️ Bỏ qua đơn #${order.orderId} (${order.status})`);
            return;
          }

          let nextStatus = "";

          switch (order.status) {
            case "Chờ duyệt":
              nextStatus = "Đang xử lý";
              break;
            case "Đang xử lý":
              nextStatus = "Đang giao hàng";
              break;
            case "Đang giao hàng":
              nextStatus = "Hoàn thành";
              break;
            default:
              nextStatus = order.status;
          }

          if (nextStatus === order.status) return;

          try {
            const updateRes = await axios.post(
              "http://localhost:8080/dossier-statistic/--update-status",
              null,
              { params: { orderid: order.orderId, status: nextStatus } }
            );

            const result = updateRes.data;

            if (result === "SUCCESS") {
              toast.info(
                `🔄 Đơn hàng #${order.orderId} tự động chuyển sang "${nextStatus}"`,
                { position: "bottom-right", autoClose: 2500 }
              );
              console.log(`✅ Auto cập nhật: ${order.orderId} → ${nextStatus}`);
            } else if (result === "INSUFFICIENT_QUANTITY") {
              toast.warning(
                `⚠️ Đơn #${order.orderId} không đủ hàng, không thể tự cập nhật!`,
                { position: "bottom-right", autoClose: 3000 }
              );
            } else if (result === "STORAGE_NOT_FOUND") {
              toast.error(
                `❌ Đơn #${order.orderId}: sản phẩm không tồn tại trong kho!`,
                { position: "bottom-right", autoClose: 3000 }
              );
            } else {
              console.warn(`⚠️ Auto update thất bại cho đơn #${order.orderId}`);
            }
          } catch (err) {
            console.error("⚠️ Lỗi auto cập nhật trạng thái:", err);
          }
        });
      } catch (err) {
        console.error("🚨 Lỗi khi fetch danh sách đơn hàng:", err);
      }
    }, 1 * 60 * 1000);

    return () => clearInterval(interval);
  }, []); // 👈 Quan trọng: chỉ chạy 1 lần khi component mount

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setStatus("");
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    setStatus("");
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder || !status) {
      alert("Vui lòng chọn trạng thái!");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:8080/dossier-statistic/--update-status",
        null,
        {
          params: {
            orderid: selectedOrder.orderId,
            status: status,
          },
        }
      );

      const result = res.data;
      if (result === "SUCCESS") {
        toast.success("Cập nhật trạng thái thành công!");
        setOrders((prevOrders) =>
          prevOrders.map((o) =>
            o.orderId === selectedOrder.orderId ? { ...o, status: status } : o
          )
        );
        handleCloseDialog();
        fetchOrders();
        window.location.reload();
      } else if (result === "ORDERID_NOT_FOUND") {
        toast.warning("Không tìm thấy mã đơn hàng!");
      } else if (result === "STORAGE_NOT_FOUND") {
        toast.warning("Sản phẩm trong kho không tồn tại!");
      } else if (result === "INSUFFICIENT_QUANTITY") {
        toast.warning("Sản phẩm trong kho không đủ số lượng!");
      } else {
        toast.warning("Có lỗi xảy ra khi cập nhật trạng thái!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/dossier-statistic/summary"
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const res = await axios.get(`http://localhost:8080/orders/${orderId}`);
      setOrderDetails(res.data.oldOrders || []);
      setOpenDetailDialog(true);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      alert("Không thể lấy chi tiết đơn hàng!");
    }
  };

  const handleViewAddress = async (orderId) => {
    try {
      const res = await fetch(
        `http://localhost:8080/orders/address/${orderId}`
      );
      if (!res.ok) throw new Error("Lỗi khi lấy địa chỉ");
      const data = await res.json();
      setAddressInfo(data);
      setOpenAddressDialog(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: "100%", p: 10 }}>
      <Typography variant="h5" gutterBottom>
        QUẢN LÝ ĐƠN HÀNG
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>MÃ ĐƠN HÀNG</TableCell>
              <TableCell sx={{ color: "white" }}>NGÀY ĐẶT HÀNG</TableCell>
              <TableCell sx={{ color: "white" }}>KHÁCH HÀNG</TableCell>
              <TableCell sx={{ color: "white" }}>SỐ ĐIỆN THOẠI</TableCell>
              <TableCell sx={{ color: "white" }}>TỔNG TIỀN</TableCell>
              <TableCell sx={{ color: "white" }}>
                PHƯƠNG THỨC THANH TOÁN
              </TableCell>
              <TableCell sx={{ color: "white" }}>TRẠNG THÁI</TableCell>
              <TableCell sx={{ color: "white" }}>THAO TÁC</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() => handleViewDetails(order.orderId)}
                  >
                    {order.orderId}
                  </Button>
                </TableCell>
                <TableCell>{order.orderDate.join("-")}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{order.phoneNumber}</TableCell>
                <TableCell>{order.totalAmount}</TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell>{order.status || "Chờ duyệt"}</TableCell>
                <TableCell>
                  <Box
                    sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenDialog(order)}
                    >
                      DUYỆT
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleViewAddress(order.orderId)}
                    >
                      XEM ĐỊA CHỈ
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Chọn trạng thái đơn hàng</DialogTitle>
        <DialogContent>
          <RadioGroup
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <FormControlLabel
              value="Chờ duyệt"
              control={<Radio />}
              label="Chờ duyệt"
            />
            <FormControlLabel
              value="Đang xử lý"
              control={<Radio />}
              label="Đang xử lý"
            />
            <FormControlLabel
              value="Đang giao hàng"
              control={<Radio />}
              label="Đang giao hàng"
            />
            <FormControlLabel
              value="Hoàn thành"
              control={<Radio />}
              label="Hoàn thành"
            />
            <FormControlLabel
              value="Đã huỷ"
              control={<Radio />}
              label="Đã huỷ"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleUpdateStatus}
            variant="contained"
            color="primary"
          >
            Lưu
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>CHI TIẾT ĐƠN HÀNG</DialogTitle>
        <DialogContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID Sản phẩm</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Giá</TableCell>
                  <TableCell>Số lượng</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderDetails.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.productId}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.price}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailDialog(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
      <Dialog
        open={openAddressDialog}
        onClose={() => setOpenAddressDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>THÔNG TIN GIAO HÀNG</DialogTitle>
        <DialogContent dividers>
          {addressInfo ? (
            <>
              <p>
                <strong>TÊN NGƯỜI NHẬN:</strong> {addressInfo.receiverName}
              </p>
              <p>
                <strong>HỌ VÀ TÊN:</strong> {addressInfo.username || "Không có"}
              </p>
              <p>
                <strong>SĐT:</strong> {addressInfo.receiverPhone}
              </p>
              <p>
                <strong>ĐỊA CHỈ:</strong> {addressInfo.shippingAddress}
              </p>
              <p>
                <strong>GHI CHÚ:</strong> {addressInfo.note || "Không có"}
              </p>
            </>
          ) : (
            <p>Đang tải dữ liệu...</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddressDialog(false)}>ĐÓNG</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OrderSummaryPage;
