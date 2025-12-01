import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/config.js";
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
  Avatar,
  Select,
  MenuItem,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);
  const accountData = JSON.parse(localStorage.getItem("account"));
  const currentRole = accountData?.role?.toUpperCase();
  const currentAccountID = accountData?.accountID;
  const isAdmin = currentRole === "ADMIN";
  const [pendingRoles, setPendingRoles] = useState({});
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deleteAccountID, setDeleteAccountID] = useState(null);
  const [deleteAccountName, setDeleteAccountName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/account/Listgetall`);
      setAccounts(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tài khoản:", err);
      toast.error("Lỗi khi lấy danh sách tài khoản");
    }
  };

  const handleSelectChange = (accountID, newRole) => {
    setPendingRoles((prev) => ({
      ...prev,
      [accountID]: newRole,
    }));
  };

  const handleSaveRole = async (accountID) => {
    const newRole = pendingRoles[accountID];
    if (!newRole) {
      toast.warn("⚠️ Vui lòng chọn quyền trước khi lưu!");
      return;
    }

    try {
      await axios.put(
        `${API_BASE_URL}/api/v1/account/grant-role/${accountID}?role=${newRole}`,
        {},
        {
          headers: { "X-Role": "ADMIN" },
        }
      );
      toast.success(`✅ Đã phân quyền thành ${newRole}`);
      setPendingRoles((prev) => {
        const updated = { ...prev };
        delete updated[accountID];
        return updated;
      });
      fetchAccounts();
    } catch (err) {
      console.error("Lỗi khi phân quyền:", err);
      toast.error("❌ Không thể phân quyền!");
    }
  };

  const handleOpenDeleteDialog = (accountID, accountName) => {
    if (accountID === 1) {
      toast.error("❌ Không thể xóa admin chính!");
      return;
    }

    if (accountID === currentAccountID) {
      toast.error("❌ Không thể xóa chính mình!");
      return;
    }

    setDeleteAccountID(accountID);
    setDeleteAccountName(accountName);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setDeleteAccountID(null);
    setDeleteAccountName("");
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/api/v1/account/${deleteAccountID}/delete`,
        {
          headers: { "X-Admin-Name": accountData?.accountName },
        }
      );

      if (res.data.success) {
        toast.success(`✅ ${res.data.message}`);
        handleCloseDeleteDialog();
        fetchAccounts();
      } else {
        toast.error(`❌ ${res.data.message}`);
      }
    } catch (err) {
      console.error("Lỗi khi xóa tài khoản:", err);
      const errorMsg =
        err.response?.data?.message || "❌ Không thể xóa tài khoản!";
      toast.error(errorMsg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedAccounts = accounts.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
        DANH SÁCH TÀI KHOẢN
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: 3,
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2563EB" }}>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                MÃ NGƯỜI DÙNG
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                ẢNH
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                TÊN TÀI KHOẢN
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                USERNAME
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                E-MAIL
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                PHONE
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                ĐỊA CHỈ
              </TableCell>
              <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                NGÀY SINH
              </TableCell>
              {isAdmin && (
                <>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    ROLE
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    PHÂN QUYỀN
                  </TableCell>
                  <TableCell sx={{ color: "white", fontSize: "1.1rem" }}>
                    HÀNH ĐỘNG
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAccounts.length > 0 ? (
              paginatedAccounts.map((acc) => {
                const pendingRole = pendingRoles[acc.accountID];
                const isChanged =
                  pendingRole && pendingRole !== acc.typeAccount;
                return (
                  <TableRow
                    key={acc.accountID}
                    sx={{
                      backgroundColor: isChanged ? "#fff7ed" : "inherit",
                      transition: "0.3s",
                    }}
                  >
                    <TableCell>{acc.accountID}</TableCell>
                    <TableCell>
                      {acc.image ? (
                        <Avatar alt={acc.accountName} src={acc.image} />
                      ) : (
                        <Avatar>{acc.accountName?.[0]}</Avatar>
                      )}
                    </TableCell>
                    <TableCell>{acc.accountName}</TableCell>
                    <TableCell>{acc.username}</TableCell>
                    <TableCell>{acc.email}</TableCell>
                    <TableCell>{acc.phoneNumber}</TableCell>
                    <TableCell>{acc.local}</TableCell>
                    <TableCell>{acc.dateOfBirth}</TableCell>
                    {isAdmin && (
                      <>
                        <TableCell>{acc.admin ? "✅" : "❌"}</TableCell>
                        <TableCell>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            sx={{ minWidth: 150 }}
                          >
                            <Select
                              value={pendingRole || acc.typeAccount || "USER"}
                              onChange={(e) =>
                                handleSelectChange(acc.accountID, e.target.value)
                              }
                              size="small"
                            >
                              <MenuItem value="USER">USER</MenuItem>
                              <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                              <MenuItem value="ADMIN">ADMIN</MenuItem>
                            </Select>
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              disabled={!isChanged}
                              onClick={() => handleSaveRole(acc.accountID)}
                            >
                              Lưu
                            </Button>
                            {isChanged && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "#f59e0b",
                                  fontWeight: "bold",
                                }}
                              >
                                Đã thay đổi
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleOpenDeleteDialog(
                                acc.accountID,
                                acc.accountName
                              )
                            }
                            sx={{
                              textTransform: "none",
                              fontSize: "0.8rem",
                            }}
                          >
                            🗑️ Xóa
                          </Button>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 11 : 8} align="center">
                  Không có tài khoản nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={accounts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Số dòng mỗi trang:"
        rowsPerPageOptions={[5, 10, 20, 50]}
      />

      {/* ← Dialog xác nhận xóa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold", fontSize: "18px" }}>
          Xác nhận xóa tài khoản
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Bạn chắc chắn muốn xóa tài khoản <strong>{deleteAccountName}</strong>?
          </Typography>
          <Typography sx={{ mt: 1, color: "error", fontWeight: "bold" }}>
            Hành động này <strong>không thể hoàn tác</strong>!
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDeleteDialog}
            variant="outlined"
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogActions>
      </Dialog>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
      />
    </Box>
  );
};

export default AccountList;