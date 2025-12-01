import React, { useEffect, useState } from "react";
import axios from "axios";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
} from "@mui/material";
import API_BASE_URL from "../config/config.js";

const Dashboard = () => {
  const [yearlyData, setYearlyData] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [dailyRevenueStatus, setDailyRevenueStatus] = useState([]);
  const [paymentStats, setPaymentStats] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    fetchYearlyData();
    fetchSalesData();
    fetchRevenueData();
    fetchDailyRevenueStatus();
    fetchPaymentStatistics();
  }, []);

  const fetchPaymentStatistics = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/payment-method`);
      setPaymentStats(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy thống kê phương thức thanh toán:", err);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/export/revenue-by-month`
      );
      setRevenueData(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu doanh thu:", err);
    }
  };

  const fetchYearlyData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/yearly`);
      setYearlyData(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu theo năm:", err);
    }
  };

  const fetchSalesData = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/v1/product/sales`);
      setSalesData(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu theo sản phẩm:", err);
    }
  };

  const fetchDailyRevenueStatus = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/export/revenue-by-day-status`
      );
      setDailyRevenueStatus(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy doanh thu theo ngày (theo trạng thái):", err);
    }
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/export/total-revenue`)
      .then((res) => setTotalRevenue(res.data))
      .catch((err) => console.error(err));
  }, []);

  const totalOrders = paymentStats.reduce((sum, item) => sum + item.total, 0);

  const chartData = salesData.map((item) => ({
    name: item.name,
    y: item.quantitysold,
  }));

  const paymentMethodOptions = {
    chart: { type: "pie" },
    title: { text: "" },
    tooltip: { pointFormat: "{series.name}: <b>{point.y}</b>" },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Số đơn hàng",
        colorByPoint: true,
        data: paymentStats.map((item) => ({
          name:
            item.paymentMethod === "VNPAY"
              ? "Thanh toán VNPAY"
              : item.paymentMethod === "COD"
              ? "Thanh toán khi nhận hàng (COD)"
              : item.paymentMethod || "Khác",
          y: item.total,
        })),
      },
    ],
  };

  const yearlyOptions = {
    chart: { type: "line" },
    title: { text: "" },
    xAxis: {
      categories: ["2024", "2025"],
      title: { text: "Năm" },
    },
    yAxis: {
      title: { text: "Số Lượng Đơn Hàng" },
    },
    series: [{ name: "Số Lượng Đơn Hàng", data: [120, 180] }],
  };

  const salesOptions = {
    chart: {
      type: "pie",
      style: { fontFamily: "'Roboto', sans-serif" },
      backgroundColor: "transparent",
      spacing: [10, 10, 10, 10],
      marginLeft: 10,
      marginRight: 10,
      marginTop: 10,
      marginBottom: 10,
    },
    title: {
      text: "",
      style: { display: "none" },
    },
    tooltip: {
      backgroundColor: "rgba(0, 0, 0, 0.85)",
      borderRadius: 8,
      borderWidth: 0,
      shadow: true,
      style: {
        color: "#fff",
        fontSize: "13px",
        fontWeight: "500",
      },
      pointFormat:
        "<span style='color:{point.color}'>\u25CF</span> <b>{point.name}</b><br/>Số lượng: <b>{point.y}</b><br/>Tỷ lệ: <b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        size: "100%", // To hết
        center: ["45%", "50%"], 
        dataLabels: {
          enabled: false, // Tắt % trên chart để rõ ràng
        },
        // dataLabels: {
        //   enabled: true,
        //   distance: -30,
        //   format: "<b>{point.percentage:.0f}%</b>",
        //   style: {
        //     fontSize: "14px",
        //     fontWeight: "bold",
        //     color: "#fff",
        //     textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
        //   },
        // },
        showInLegend: true,
        states: {
          hover: {
            brightness: 0.15,
          },
        },
      },
    },
    legend: {
      display: "none",
      enabled: false,
    },  
  //   legend: {
  //     layout: "vertical",
  //     align: "right",
  //     verticalAlign: "middle",
  //     itemStyle: {
  //       fontSize: "13px",
  //       fontWeight: "500",
  //       color: "#333",
  //     },
  //   symbolRadius: 5,
  //   padding: 0,
  //   itemMarginBottom: 4,
  //   maxHeight: 300,
  //   width: 140,
  // },
    colors: [
      "#4facfe",
      "#00f2fe",
      "#43e97b",
      "#fa709a",
      "#fee140",
      "#30b0fe",
      "#a8edea",
      "#fed6e3",
    ],
    series: [
      {
        name: "Số lượng bán",
        colorByPoint: true,
        data: chartData,
      },
    ],
  };

  const revenueOptions = {
    chart: { type: "column" },
    title: { text: "" },
    xAxis: {
      categories: revenueData.map((item) => item.month),
      title: { text: "Tháng" },
    },
    yAxis: {
      min: 0,
      title: { text: "Doanh thu (VNĐ)" },
    },
    tooltip: {
      pointFormat: "Doanh thu: <b>{point.y:,.0f} VND</b>",
    },
    series: [
      {
        name: "Doanh thu",
        data: revenueData.map((item) => item.revenue),
        color: "#4f46e5",
      },
    ],
  };

  const dailyRevenueStatusOptions = {
    chart: { type: "line" },
    title: { text: "" },
    xAxis: {
      categories: [...new Set(dailyRevenueStatus.map((item) => item.day))],
      title: { text: "Ngày" },
    },
    yAxis: {
      title: { text: "Doanh thu (VNĐ)" },
    },
    tooltip: {
      shared: true,
      valueSuffix: " VND",
    },
    series: ["Hoàn thành", "Chờ duyệt"].map((status) => ({
      name: status,
      data: [...new Set(dailyRevenueStatus.map((item) => item.day))].map(
        (day) => {
          const record = dailyRevenueStatus.find(
            (d) => d.day === day && d.status === status
          );
          return record ? record.revenue : 0;
        }
      ),
    })),
  };

  return (
    <Box
      sx={{
        p: 3,
        mt: 10,
        background: "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
        minHeight: "100vh",
      }}
    >
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
        📊 TỔNG QUAN
      </Typography>

      {/* ✅ THÊM 4 STAT CARDS */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Card 1: Tổng Doanh Thu */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #10b98108 0%, #ffffff 100%)",
              border: "1px solid #10b98120",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px #10b98130",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#10b98115",
                    width: 50,
                    height: 50,
                    boxShadow: "0 4px 12px #10b98125",
                  }}
                >
                  <Typography sx={{ fontSize: 26 }}>💰</Typography>
                </Avatar>
                <Chip
                  label="+15.3%"
                  size="small"
                  sx={{
                    bgcolor: "#10b981",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6c757d",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                Tổng doanh thu
              </Typography>
              <Typography
                sx={{ fontSize: 24, fontWeight: 700, color: "#10b981" }}
              >
                {totalRevenue.toLocaleString("vi-VN")} ₫
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2: Tổng Đơn Hàng */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #6366f108 0%, #ffffff 100%)",
              border: "1px solid #6366f120",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px #6366f130",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#6366f115",
                    width: 50,
                    height: 50,
                    boxShadow: "0 4px 12px #6366f125",
                  }}
                >
                  <Typography sx={{ fontSize: 26 }}>🛒</Typography>
                </Avatar>
                <Chip
                  label="+12.5%"
                  size="small"
                  sx={{
                    bgcolor: "#10b981",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6c757d",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                Tổng đơn hàng
              </Typography>
              <Typography
                sx={{ fontSize: 24, fontWeight: 700, color: "#6366f1" }}
              >
                {totalOrders > 0 ? totalOrders.toLocaleString() : "10,234"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3: Người Dùng Mới */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #f59e0b08 0%, #ffffff 100%)",
              border: "1px solid #f59e0b20",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px #f59e0b30",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#f59e0b15",
                    width: 50,
                    height: 50,
                    boxShadow: "0 4px 12px #f59e0b25",
                  }}
                >
                  <Typography sx={{ fontSize: 26 }}>👥</Typography>
                </Avatar>
                <Chip
                  label="+8.2%"
                  size="small"
                  sx={{
                    bgcolor: "#10b981",
                    color: "white",
                    fontWeight: 600,
                    fontSize: "0.7rem",
                    height: 22,
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6c757d",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                Người dùng mới
              </Typography>
              <Typography
                sx={{ fontSize: 24, fontWeight: 700, color: "#f59e0b" }}
              >
                1,220
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4: Tỷ Lệ Thành Công */}
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              transition: "all 0.3s ease",
              background: "linear-gradient(135deg, #ec489908 0%, #ffffff 100%)",
              border: "1px solid #ec489920",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: "0 8px 30px #ec489930",
              },
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 2,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#ec489915",
                    width: 50,
                    height: 50,
                    boxShadow: "0 4px 12px #ec489925",
                  }}
                >
                  <Typography sx={{ fontSize: 26 }}>✅</Typography>
                </Avatar>
              </Box>
              <Typography
                sx={{
                  fontSize: 13,
                  color: "#6c757d",
                  fontWeight: 500,
                  mb: 0.5,
                }}
              >
                Tỷ lệ thành công
              </Typography>
              <Typography
                sx={{ fontSize: 24, fontWeight: 700, color: "#ec4899" }}
              >
                98.5%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* CHARTS - Layout mới */}
      <Grid container spacing={3}>
        {/* Row 1: 2 charts */}
        <Grid item xs={12} lg={6}>
          <Card
            sx={{
              height: 400,
              minHeight: 400,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom>
                📈 THỐNG KÊ ĐƠN HÀNG THEO NĂM
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={yearlyOptions}
                  containerProps={{ style: { height: "100%", width: "100%" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 1: Chart thanh toán */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: 450, borderRadius: 3, boxShadow: 3 }}>
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 700 }}>
                💳 THỐNG KÊ THEO PHƯƠNG THỨC THANH TOÁN
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  options={paymentMethodOptions}
                  containerProps={{ style: { height: "100%", width: "100%" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 1: Nguồn doanh thu */}
        <Grid item xs={12} md={12}>
          <Card
            sx={{
              height: 450,
              borderRadius: 3,
              boxShadow: 3,
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                transform: "translateY(-2px)",
              },
            }}
          >
            <CardContent
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                p: 0,
                "&:last-child": { pb: 0 },
              }}
            >
              <Box sx={{ p: 2.5, pb: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "700",
                    fontSize: "16px",
                    color: "#1a1a1a",
                  }}
                >
                  📊 NGUỒN DOANH THU
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  minHeight: 0,
                  width: "100%"
                }}
              >
                <HighchartsReact
                  highcharts={Highcharts}
                  options={salesOptions}
                  containerProps={{
                    style: {
                      height: "100%",
                      width: "100%",
                    },
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Row 3: 2 charts */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              minHeight: 400,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom>
                💰 DOANH THU THEO THÁNG
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={revenueOptions}
                  containerProps={{ style: { height: "100%", width: "100%" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card
            sx={{
              height: "100%",
              minHeight: 400,
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <CardContent
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <Typography variant="h6" gutterBottom>
                📅 DOANH THU THEO NGÀY (PHÂN THEO TRẠNG THÁI)
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <HighchartsReact
                  highcharts={Highcharts}
                  options={dailyRevenueStatusOptions}
                  containerProps={{ style: { height: "100%", width: "100%" } }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
