// src/utils/auth.js

// Lưu thông tin đăng nhập vào localStorage
export const setAuth = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

// Lấy thông tin đăng nhập
export const getAuth = () => {
  const data = localStorage.getItem("auth");
  return data ? JSON.parse(data) : { isLoggedIn: false };
};

// Xoá thông tin đăng nhập
export const clearAuth = () => {
  localStorage.removeItem("auth");
};
