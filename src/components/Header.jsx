import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Box,
  TextField,
  Button,
  Badge,
  Divider,
  Paper,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Mail";
import CloseIcon from "@mui/icons-material/Close";
import MinimizeIcon from "@mui/icons-material/Minimize";
import useAuthCookie from "../hooks/useAuthCookie";
import { db } from "../firebase/firebaseConfig";
import { ref, get, onValue, off } from "firebase/database";
import API_BASE_URL from "../config/config.js";
import {
  getAccountById,
  updateAccount,
  changePassword,
} from "../api/accountApi";

const Header = ({ drawerWidth }) => {
  const { accountName } = useAuthCookie();
  const [openChatList, setOpenChatList] = useState(false);
  const [openChatBox, setOpenChatBox] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatWithUser, setChatWithUser] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [newMsgCount, setNewMsgCount] = useState(0);
  const [readUsers, setReadUsers] = useState([]);
  const chatEndRef = useRef(null);
  const listenerRef = useRef(null);
  const navigate = useNavigate();

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingChange, setLoadingChange] = useState(false);

  const [messageChangePassword, setMessageChangePassword] = useState("");
  const [isSuccessChangePassword, setIsSuccessChangePassword] = useState(false);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const accountId = localStorage.getItem("accountId");

  const [role, setRole] = useState(null);
  const [accountname, setaccountname] = useState("");

  const [openEditProfile, setOpenEditProfile] = useState(false);
  const [messageEditProfile, setMessageEditProfile] = useState("");
  const [isSuccessEditProfile, setIsSuccessEditProfile] = useState(false);

  const [currentTime, setCurrentTime] = useState("");

  const [accountInfo, setAccountInfo] = useState({
    accountName: "",
    username: "",
    phoneNumber: "",
    email: "",
    local: "",
    dateOfBirth: "",
    image: "",
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [minimizeChatBox, setMinimizeChatBox] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formatted =
        now.getDate().toString().padStart(2, "0") +
        "/" +
        (now.getMonth() + 1).toString().padStart(2, "0") +
        "/" +
        now.getFullYear() +
        " " +
        now.toLocaleTimeString("vi-VN");
      setCurrentTime(formatted);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatWithUser]);

  useEffect(() => {// tắt lắng nghe khi component unmount
    return () => {
      off(ref(db, "chat/conversations"));
    };
  }, []);

  useEffect(() => {
    try {
      const accountData = JSON.parse(localStorage.getItem("account"));
      if (accountData) {
        setRole(accountData.role);
        setaccountname(accountData.accountName);
      }
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (listenerRef.current) {
        off(listenerRef.current);
        listenerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!openChatBox) {
      if (listenerRef.current) {
        off(listenerRef.current);
        listenerRef.current = null;
      }
    }
  }, [openChatBox]);

  const getRoleDisplayName = (userRole) => {
    switch (userRole) {
      case "ADMIN":
        return "QUẢN TRỊ VIÊN";
      case "EMPLOYEE":
        return "NHÂN VIÊN";
      case "USER":
        return "NGƯỜI DÙNG";
      default:
        return "NGƯỜI DÙNG";
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/v1/account/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("account");
      localStorage.removeItem("accountId");
      localStorage.removeItem("accountName");
      localStorage.removeItem("auth");
      navigate("/login");
    } catch (err) {
      console.error("Lỗi logout:", err);
    }
  };

  const handleOpenChangePassword = () => {
    setOpenChangePassword(true);
    setMessageChangePassword("");
    setAnchorEl(null);
  };

  const handleChangePassword = async () => {
    setLoadingChange(true);
    setMessageChangePassword("");

    const result = await changePassword(
      accountId,
      oldPassword,
      newPassword,
      confirmPassword
    );

    setIsSuccessChangePassword(result.success);
    setMessageChangePassword(result.message);

    if (result.success) {
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        setOpenChangePassword(false);
        setMessageChangePassword("");
      }, 2000);
    }

    setLoadingChange(false);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setAccountInfo((prev) => ({
          ...prev,
          image: base64String,
        }));
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditProfile = async () => {
    setOpenEditProfile(true);
    setMessageEditProfile("");
    setAnchorEl(null);
    const id = localStorage.getItem("accountId");
    try {
      const data = await getAccountById(id);
      setAccountInfo({
        accountName: data.accountName || "",
        username: data.username || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        local: data.local || "",
        dateOfBirth: data.dateOfBirth || "",
        image: data.image || "",
      });
      setPreviewImage(data.image || "");
    } catch (err) {
      console.error("Lỗi khi lấy thông tin tài khoản:", err);
    }
  };

  const handleUpdateProfile = async () => {
    setLoadingUpdate(true);
    const id = localStorage.getItem("accountId");

    try {
      await updateAccount(id, accountInfo);
      setMessageEditProfile("CẬP NHẬT TÀI KHOẢN THÀNH CÔNG ✅");
      setIsSuccessEditProfile(true);
      setTimeout(() => {
        setOpenEditProfile(false);
        setMessageEditProfile("");
      }, 1500);
    } catch (err) {
      console.error("Lỗi khi cập nhật tài khoản:", err);
      setMessageEditProfile("CẬP NHẬT THẤT BẠI ❌");
      setIsSuccessEditProfile(false);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const handleOpenChatList = async () => {
    setOpenChatList(true);
    setLoading(true);
    try {
      const snapshot = await get(ref(db, "chat/conversations"));//mở danh sách chat
      if (snapshot.exists()) {
        const data = snapshot.val();

        const users = Object.keys(data || {}).filter(
          (key) =>
            data[key] &&
            typeof data[key] === "object" &&
            Object.values(data[key])[0]?.sender
        );

        const latestMsgs = users.map((user) => {//lấy tất cả tin nhắn map
          const msgs = Object.values(data[user]);
          const lastMsg = msgs[msgs.length - 1];
          return {
            sender: user,
            content: lastMsg.content,
            timestamp: lastMsg.timestamp,
          };
        });

        setMessages(latestMsgs.reverse());
      }
    } catch (err) {
      console.error("Lỗi tải tin nhắn:", err);
    } finally {
      setLoading(false);
    }

    const chatRef = ref(db, "chat/conversations");
    off(chatRef);

    onValue(chatRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      let newCount = 0;
      Object.keys(data).forEach((user) => {
        const msgs = Object.values(data[user]);
        const lastMsg = msgs[msgs.length - 1];
        if (
          lastMsg &&
          lastMsg.sender !== "Admin" &&
          !readUsers.includes(user)
        ) {
          newCount++;//đếm số tin nhắn mới khi click vào icon mail
        }
      });

      setNewMsgCount(newCount);
    });
  };

  const handleSelectUser = async (senderName) => {
    setSelectedUser(senderName);
    setOpenChatBox(true);
    setOpenChatList(false);

    setReadUsers((prev) => [...new Set([...prev, senderName])]);

    const chatRef = ref(db, `chat/conversations/${senderName}`);//chọn người để xử lý chat

    if (listenerRef.current) {
      off(listenerRef.current);
      listenerRef.current = null;
    }

    try {
      const snapshot = await get(chatRef);// thực hiện lấy toàn bộ tin nhắn với người dùng đã chọn
      if (snapshot.exists()) {
        const data = snapshot.val();
        const allMessages = Object.entries(data)
          .map(([key, value]) => ({
            id: key,
            ...value,
          }))
          .sort((a, b) => a.timestamp - b.timestamp);

        setChatWithUser(allMessages);
      } else {
        setChatWithUser([]);
      }
    } catch (err) {
      console.error("Load error:", err);
      setChatWithUser([]);
    }

    const callback = (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setChatWithUser([]);
        return;
      }
      const allMessages = Object.entries(data)
        .map(([key, value]) => ({
          id: key,
          ...value,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

      setChatWithUser(allMessages);
    };

    listenerRef.current = chatRef;//lắng nghe thay đổi tin nhắn với người dùng đã chọn
    onValue(chatRef, callback);

    setNewMsgCount((prev) => Math.max(prev - 1, 0));//xem tin nhắn giảm thông báo
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedUser) {
      console.warn("Thiếu replyText hoặc selectedUser");
      return;
    }
    try {
      const message = replyText;
      setReplyText("");

      const encodedContent = encodeURIComponent(`(${selectedUser}) ${message}`);
      const response = await fetch(// gửi phản hồi qua API
        `${API_BASE_URL}/api/chat/send?sender=Admin&content=${encodedContent}`,
        { method: "POST" }
      );

      if (!response.ok) {
        console.error("API error:", response.statusText);
      }
    } catch (err) {
      console.error("Lỗi khi gửi phản hồi:", err);
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        transition: "0.3s",
        background: "#2563EB",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            lineHeight: "1.2",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {getRoleDisplayName(role)}
          </Typography>
          <Typography
            variant="body2"
            style={{
              fontSize: "0.75rem",
              opacity: 0.9,
              marginTop: "2px",
            }}
          >
            {currentTime}
          </Typography>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <IconButton color="inherit" onClick={handleOpenChatList}>
            <Badge
              badgeContent={newMsgCount}
              color="error"
              overlap="circular"
              invisible={newMsgCount === 0}
            ></Badge>
            <MailIcon />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Avatar
              sx={{ width: 32, height: 32, cursor: "pointer" }}
              onClick={handleMenuOpen}
            >
              {accountName ? accountName.charAt(0).toUpperCase() : "?"}
            </Avatar>
            <Typography
              variant="body1"
              onClick={handleMenuOpen}
              style={{ cursor: "pointer" }}
            >
              {accountName}
            </Typography>
          </div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleOpenEditProfile}>
              CHỈNH SỬA THÔNG TIN
            </MenuItem>
            <MenuItem onClick={handleOpenChangePassword}>ĐỔI MẬT KHẨU</MenuItem>
            <MenuItem onClick={handleLogout}>ĐĂNG XUẤT</MenuItem>
          </Menu>
        </div>
      </Toolbar>
      
      {/* Chat Box dialog */}
      <Dialog
        open={openChatList}
        onClose={() => setOpenChatList(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          Tin nhắn khách hàng
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <List>
              {messages.map((msg) => (
                <ListItem
                  key={msg.sender}
                  button
                  onClick={() => handleSelectUser(msg.sender)}
                  sx={{
                    backgroundColor: readUsers.includes(msg.sender)
                      ? "#f5f5f5"
                      : "#e3f2fd",
                    mb: 1,
                    borderRadius: 2,
                    "&:hover": { backgroundColor: "#bbdefb" },
                  }}
                >
                  <ListItemText
                    primary={<b>{msg.sender}</b>}
                    secondary={msg.content}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

      {/* Chat Box Sidebar bên phải */}
      {openChatBox && (
        <Paper
          sx={{
            position: "fixed",
            right: 0,
            bottom: 0,
            width: 380,
            maxWidth: "calc(100% - " + drawerWidth + "px)",
            height: minimizeChatBox ? 50 : 500,
            borderRadius: "8px 8px 0 0",
            boxShadow: "-2px -2px 10px rgba(0,0,0,0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 1200,
            backgroundColor: "#fff",
            transition: "height 0.3s ease",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              backgroundColor: "#2563EB",
              color: "#fff",
              borderRadius: "8px 8px 0 0",
              cursor: minimizeChatBox ? "pointer" : "default",
            }}
            onClick={() => minimizeChatBox && setMinimizeChatBox(false)}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedUser}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                size="small"
                sx={{ color: "#fff" }}
                onClick={() => setMinimizeChatBox(!minimizeChatBox)}
                title={minimizeChatBox ? "Phóng to" : "Thu nhỏ"}
              >
                <MinimizeIcon />
              </IconButton>
              <IconButton
                size="small"
                sx={{ color: "#fff" }}
                onClick={() => setOpenChatBox(false)}
                title="Đóng"
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {!minimizeChatBox && (
            <>
              <Divider />
              {/* Chat Messages */}
              <Box
                sx={{
                  flex: 1,
                  overflowY: "auto",
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                {chatWithUser.map((msg, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.sender === "Admin" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor:
                          msg.sender === "Admin" ? "#bbdefb" : "#f1f1f1",
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        maxWidth: "80%",
                        wordWrap: "break-word",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{ color: "#666", display: "block" }}
                      >
                        <b>{msg.sender}:</b>
                      </Typography>
                      <Typography variant="body2">{msg.content}</Typography>
                    </Box>
                  </Box>
                ))}
                <div ref={chatEndRef} />
              </Box>

              <Divider />
              {/* Input */}
              <Box sx={{ p: 2, display: "flex", gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Nhập tin nhắn..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
                <Button
                  variant="contained"
                  onClick={handleSendReply}
                  sx={{ borderRadius: 2 }}
                >
                  Gửi
                </Button>
              </Box>
            </>
          )}
        </Paper>
      )}

      {/* <Dialog
        open={openChatBox}
        onClose={() => setOpenChatBox(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: 600 }}>
          {selectedUser}
        </DialogTitle>
        <DialogContent>
          <Box
            className="admin-chat-body"
            sx={{
              maxHeight: 400,
              overflowY: "auto",
              mb: 2,
              pr: 1,
              pt: 1,
            }}
          >
            {chatWithUser.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  textAlign: msg.sender === "Admin" ? "right" : "left",
                  mb: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    backgroundColor:
                      msg.sender === "Admin" ? "#bbdefb" : "#f1f1f1",
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    maxWidth: "75%",
                  }}
                >
                  <b>{msg.sender}:</b> {msg.content}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Nhập nội dung phản hồi..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
            />
            <Button variant="contained" onClick={handleSendReply}>
              Gửi
            </Button>
          </Box>
        </DialogContent>
      </Dialog> */}

      {/* Dialog đổi mật khẩu */}
      <Dialog
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            textAlign: "center",
            backgroundColor: "#2563EB",
            color: "#fff",
          }}
        >
          ĐỔI MẬT KHẨU
        </DialogTitle>

        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="Mật khẩu cũ"
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Xác nhận mật khẩu mới"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              size="small"
            />

            {messageChangePassword && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: isSuccessChangePassword ? "green" : "error.main",
                  mt: 1,
                }}
              >
                {messageChangePassword}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenChangePassword(false)}
              >
                HỦY
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
                disabled={loadingChange}
              >
                {loadingChange ? "ĐANG XỬ LÝ..." : "XÁC NHẬN"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa profile */}
      <Dialog
        open={openEditProfile}
        onClose={() => setOpenEditProfile(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            textAlign: "center",
            backgroundColor: "#2563EB",
            color: "#fff",
          }}
        >
          CHỈNH SỬA THÔNG TIN
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <TextField
              label="TÊN ĐĂNG NHẬP"
              value={accountInfo.accountName}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, accountName: e.target.value })
              }
              disabled
              fullWidth
              size="small"
            />
            <TextField
              label="HỌ VÀ TÊN"
              value={accountInfo.username}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, username: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="EMAIL"
              value={accountInfo.email}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, email: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="SỐ ĐIỆN THOẠI"
              value={accountInfo.phoneNumber}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, phoneNumber: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="ĐỊA CHỈ"
              value={accountInfo.local}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, local: e.target.value })
              }
              fullWidth
              size="small"
            />
            <TextField
              label="NGÀY SINH"
              type="date"
              value={accountInfo.dateOfBirth}
              onChange={(e) =>
                setAccountInfo({ ...accountInfo, dateOfBirth: e.target.value })
              }
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />

            <Box sx={{ textAlign: "center" }}>
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
              )}
              <Button variant="contained" component="label" sx={{ mt: 1 }}>
                Chọn ảnh
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                />
              </Button>
            </Box>

            {messageEditProfile && (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: isSuccessEditProfile ? "green" : "error.main",
                  mt: 1,
                }}
              >
                {messageEditProfile}
              </Typography>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 1,
                mt: 3,
              }}
            >
              <Button
                variant="outlined"
                color="error"
                onClick={() => setOpenEditProfile(false)}
              >
                HỦY
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpdateProfile}
                disabled={loadingUpdate}
              >
                {loadingUpdate ? "ĐANG XỬ LÝ..." : "LƯU THAY ĐỔI"}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </AppBar>
  );
};

export default Header;
