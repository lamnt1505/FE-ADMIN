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
  Avatar,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AccountList = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8080/api/v1/account/Listgetall"
      );
      setAccounts(res.data);
      toast.success("Load dữ liệu thành công");
    } catch (err) {
      console.error("Lỗi khi lấy danh sách tài khoản:", err);
      toast.error("Lỗi khi lấy danh sách tài khoản");
    }
  };
  const handleRoleChange = async (accountID, newRole) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/account/grant-role/${accountID}?role=${newRole}`,
        {},
        {
          headers: {
            "X-Role": "ADMIN",
          },
        }
      );
      toast.success(`Đã phân quyền thành ${newRole}`);
      fetchAccounts();
    } catch (err) {
      console.error("Lỗi khi phân quyền:", err);
      toast.error("Không thể phân quyền");
    }
  };
  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Typography variant="h5" gutterBottom>
        Danh Sách Tài Khoản
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell>
                <b>Ảnh</b>
              </TableCell>
              <TableCell>
                <b>Tên tài khoản</b>
              </TableCell>
              <TableCell>
                <b>Username</b>
              </TableCell>
              <TableCell>
                <b>Email</b>
              </TableCell>
              <TableCell>
                <b>SĐT</b>
              </TableCell>
              <TableCell>
                <b>Địa chỉ</b>
              </TableCell>
              <TableCell>
                <b>Ngày sinh</b>
              </TableCell>
              <TableCell>
                <b>Role</b>
              </TableCell>
              <TableCell>
                <b>Thao tác</b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accounts.map((acc) => (
              <TableRow key={acc.accountID}>
                <TableCell>{acc.accountID}</TableCell>
                <TableCell>
                  {acc.imageBase64 ? (
                    <Avatar
                      alt={acc.accountName}
                      src={`data:image/png;base64,${acc.imageBase64}`}
                    />
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
                <TableCell>{acc.admin ? "✅" : "❌"}</TableCell>
                <TableCell>
                  <Select
                    value={acc.typeAccount || "USER"}
                    onChange={(e) =>
                      handleRoleChange(acc.accountID, e.target.value)
                    }
                    size="small"
                  >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="EMPLOYEE">EMPLOYEE</MenuItem>
                    <MenuItem value="ADMIN">ADMIN</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleRoleChange(acc.accountID, acc.typeAccount)
                    }
                  >
                    Lưu
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
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
