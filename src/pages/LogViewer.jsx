import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/config.js';
import {
  Paper,
  Button,
  Box,
  Typography,
  CircularProgress,
  Pagination,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Download, Trash2, RotateCw } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LogViewer = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [totalLines, setTotalLines] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const size = 50;

  const fetchLogs = async (pageNum) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/logs/read?page=${pageNum}&size=${size}`
      );
      const data = await res.json();
      console.log("API Response:", data);
      setLogs(data.logs || []);
      setTotalLines(data.totalLines);
      
      if (data.logs && data.logs.length > 0) {
      }
    } catch (err) {
      toast.error('Lỗi khi tải logs: ' + err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const handleDownload = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/logs/download`);
      
      if (!res.ok) {
        toast.error('❌ Lỗi khi tải xuống file logs', {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'logfile.log';
      a.click();
      
      toast.success('Tải xuống file logs thành công', {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      toast.error('Lỗi khi tải xuống: ' + err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmClear = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/logs/clear`, { 
        method: 'POST' 
      });
      
      if (!res.ok) {
        throw new Error('Lỗi khi xóa logs');
      }
      
      toast.success('Đã xóa tất cả logs thành công', {
        position: "top-right",
        autoClose: 2000,
      });
      setOpenConfirmDialog(false);
      setPage(0);
      fetchLogs(0);
    } catch (err) {
      toast.error('❌ Lỗi khi xóa logs: ' + err.message, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelClear = () => {
    toast.info('Hủy xóa logs', {
      position: "top-right",
      autoClose: 1500,
    });
    setOpenConfirmDialog(false);
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch = log.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filter === 'ALL' ||
      log.toUpperCase().includes(filter);
    return matchSearch && matchFilter;
  });

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer 
        position="top-right" 
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    
      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          Xác nhận xóa logs
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography>
            Bạn chắc chắn muốn xóa <strong>tất cả logs</strong>?
          </Typography>
          <Typography sx={{ mt: 1, color: 'error', fontWeight: 'bold' }}>
            Hành động này <strong>không thể hoàn tác</strong>!
          </Typography>
          <Typography sx={{ mt: 2, color: 'gray', fontSize: '12px' }}>
            Tổng số dòng logs sẽ bị xóa: <strong>{totalLines}</strong>
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={handleCancelClear}
            variant="outlined"
          >
            Hủy
          </Button>
          <Button 
            onClick={handleConfirmClear}
            variant="contained"
            color="error"
            disabled={isDeleting}
          >
            {isDeleting ? <CircularProgress size={20} /> : 'Xóa tất cả'}
          </Button>
        </DialogActions>
      </Dialog>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        System Logs
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            placeholder="Tìm kiếm logs..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant={filter === 'ALL' ? 'contained' : 'outlined'}
              onClick={() => {
                setFilter('ALL');
                setPage(0);
              }}
              size="small"
            >
              Tất cả
            </Button>
            <Button
              variant={filter === 'ERROR' ? 'contained' : 'outlined'}
              onClick={() => {
                setFilter('ERROR');
                setPage(0);
              }}
              size="small"
              color="error"
            >
              Error
            </Button>
            <Button
              variant={filter === 'WARN' ? 'contained' : 'outlined'}
              onClick={() => {
                setFilter('WARN');
                setPage(0);
              }}
              size="small"
              color="warning"
            >
              Cảnh báo
            </Button>
            <Button
              variant={filter === 'INFO' ? 'contained' : 'outlined'}
              onClick={() => {
                setFilter('INFO');
                setPage(0);
              }}
              size="small"
              color="info"
            >
              Info
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Button
          startIcon={<RotateCw size={18} />}
          onClick={() => {
            toast.info('🔄 Đang làm mới logs...', {
              position: "top-right",
              autoClose: 1500,
            });
            fetchLogs(page);
          }}
          variant="outlined"
        >
          Làm mới
        </Button>
        <Button
          startIcon={<Download size={18} />}
          onClick={handleDownload}
          variant="outlined"
        >
          Tải xuống
        </Button>
        <Button
          startIcon={<Trash2 size={18} />}
          onClick={handleOpenConfirmDialog}
          variant="outlined"
          color="error"
        >
          Xóa tất cả
        </Button>
      </Box>
      <Paper
        sx={{
          p: 2,
          bgcolor: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: 'monospace',
          fontSize: '12px',
          maxHeight: '600px',
          overflow: 'auto',
          mb: 2,
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress size={30} />
          </Box>
        ) : filteredLogs.length === 0 ? (
          <Typography sx={{ color: '#888' }}>Không có logs</Typography>
        ) : (
          filteredLogs.map((log, idx) => (
            <div
              key={idx}
              style={{
                color: log.includes('ERROR')
                  ? '#ff6b6b'
                  : log.includes('WARN')
                  ? '#ffa500'
                  : log.includes('INFO')
                  ? '#4fc3f7'
                  : '#d4d4d4',
                marginBottom: '4px',
              }}
            >
              {log}
            </div>
          ))
        )}
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={Math.ceil(totalLines / size)}
          page={page + 1}
          onChange={(e, value) => setPage(value - 1)}
          disabled={loading}
        />
      </Box>
      <Typography sx={{ mt: 2, color: 'gray', fontSize: '12px' }}>
        Tổng cộng: {totalLines} dòng | Hiển thị: {filteredLogs.length} | Trang:{' '}
        {page + 1}
      </Typography>
    </Box>
  );
};

export default LogViewer;