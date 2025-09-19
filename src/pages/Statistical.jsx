import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
}

const StatisticsPage = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [productStats, setProductStats] = useState([]);
  const [yearStats, setYearStats] = useState([]);
  const [monthStats, setMonthStats] = useState([]);
  const [quarterStats, setQuarterStats] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, yearRes, monthRes, quarterRes] = await Promise.all([
          axios.get("http://localhost:8080/api/statistics/product"),
          axios.get("http://localhost:8080/api/statistics/year"),
          axios.get("http://localhost:8080/api/statistics/month"),
          axios.get("http://localhost:8080/api/statistics/quarter"),
        ]);

        setProductStats(productRes.data);
        setYearStats(yearRes.data);
        setMonthStats(monthRes.data);
        setQuarterStats(quarterRes.data);

        toast.success("Load dữ liệu thành công");
      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
        toast.error("Không thể load dữ liệu. Vui lòng thử lại!");
      }
    };

    fetchData();
  }, []);

  const tableStyles = {
    header: {
      backgroundColor: "#1976d2",
      color: "white",
      fontWeight: "bold",
      fontSize: "1rem",
      textAlign: "center",
    },
    cell: {
      textAlign: "center",
      fontSize: "0.95rem",
    },
    container: {
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      borderRadius: "8px",
      mb: 3,
    },
  };

  const renderNumber = (num) => new Intl.NumberFormat().format(num);

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thống kê đơn hàng
      </Typography>
      <Tabs
        value={tabIndex}
        onChange={(e, newVal) => setTabIndex(newVal)}
        sx={{ mb: 3 }}
      >
        <Tab label="Sản phẩm" />
        <Tab label="Theo Năm" />
        <Tab label="Theo Tháng" />
        <Tab label="Theo Quý" />
      </Tabs>
      <TabPanel value={tabIndex} index={0}>
        <TableContainer component={Paper} sx={tableStyles.container}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.header}>Tên sản phẩm</TableCell>
                <TableCell sx={tableStyles.header}>Số lượng bán</TableCell>
                <TableCell sx={tableStyles.header}>Doanh thu</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productStats.map((p) => (
                <TableRow key={p.id}>
                  <TableCell sx={tableStyles.cell}>{p.name}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(p.quantitysold)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(p.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <TableContainer component={Paper} sx={tableStyles.container}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.header}>Năm</TableCell>
                <TableCell sx={tableStyles.header}>Số đơn</TableCell>
                <TableCell sx={tableStyles.header}>Tổng</TableCell>
                <TableCell sx={tableStyles.header}>Min</TableCell>
                <TableCell sx={tableStyles.header}>Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {yearStats.map((y) => (
                <TableRow key={y.year}>
                  <TableCell sx={tableStyles.cell}>{y.year}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(y.orderCount)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(y.total)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(y.minTotal)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(y.maxTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <TableContainer component={Paper} sx={tableStyles.container}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.header}>Tháng</TableCell>
                <TableCell sx={tableStyles.header}>Năm</TableCell>
                <TableCell sx={tableStyles.header}>Số đơn</TableCell>
                <TableCell sx={tableStyles.header}>Tổng</TableCell>
                <TableCell sx={tableStyles.header}>Min</TableCell>
                <TableCell sx={tableStyles.header}>Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {monthStats.map((m, index) => (
                <TableRow key={index}>
                  <TableCell sx={tableStyles.cell}>{m.month}</TableCell>
                  <TableCell sx={tableStyles.cell}>{m.year}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(m.orderCount)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(m.total)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(m.minTotal)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(m.maxTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <TableContainer component={Paper} sx={tableStyles.container}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableStyles.header}>Năm</TableCell>
                <TableCell sx={tableStyles.header}>Quý</TableCell>
                <TableCell sx={tableStyles.header}>Số đơn</TableCell>
                <TableCell sx={tableStyles.header}>Tổng</TableCell>
                <TableCell sx={tableStyles.header}>Min</TableCell>
                <TableCell sx={tableStyles.header}>Max</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quarterStats.map((q, index) => (
                <TableRow key={index}>
                  <TableCell sx={tableStyles.cell}>{q.year}</TableCell>
                  <TableCell sx={tableStyles.cell}>{q.quarter}</TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(q.orderCount)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(q.total)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(q.minTotal)}
                  </TableCell>
                  <TableCell sx={tableStyles.cell}>
                    {renderNumber(q.maxTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      <ToastContainer position="top-right" autoClose={2000} />
    </Box>
  );
};

export default StatisticsPage;
