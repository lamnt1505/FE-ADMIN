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
  Rating,
  Pagination
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config/config.js";

const ProductVotePage = () => {
  const [votes, setVotes] = useState([]);

  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchVotes();
  }, []);

  const fetchVotes = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/votes/List--get--all`);
      setVotes(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đánh giá:", err);
      toast.error("Không thể load dữ liệu. Vui lòng thử lại!");
    }
  };

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
        DANH SÁCH ĐÁNH GIÁ SẢN PHẨM
      </Typography>

      <TableContainer
        component={Paper}
        sx={{ boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}
      >
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>STT</TableCell>
              <TableCell sx={{ color: "white" }}>MÃ SẢN PHẨM</TableCell>
              <TableCell sx={{ color: "white" }}>NGƯỜI ĐÁNH GIÁ</TableCell>
              <TableCell sx={{ color: "white" }}>NỘI DUNG</TableCell>
              <TableCell sx={{ color: "white" }}>SỐ SAO</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {votes.map((vote, index) => (
              <TableRow key={index}>
                <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                <TableCell>{vote.productID}</TableCell>
                <TableCell>{vote.username || vote.accountID || "Ẩn danh"}</TableCell>
                <TableCell>{vote.comment}</TableCell>
                <TableCell>
                  <Rating value={vote.rating} readOnly />
                </TableCell>
              </TableRow>
            ))}

            {votes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Không có đánh giá nào
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
          color="primary"
          shape="rounded"
        />
      </Box>

      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
};

export default ProductVotePage;