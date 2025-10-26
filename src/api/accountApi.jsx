
import axios from "axios";
const API_URL = "http://localhost:8080/api/v1/account";
export const changePassword = async (accountId, oldPassword, newPassword, confirmPassword) => {
  const apiUrl = `${API_URL}/changer-password/${accountId}?oldPassword=${encodeURIComponent(
    oldPassword
  )}&newPassword=${encodeURIComponent(newPassword)}&confirmPassword=${encodeURIComponent(confirmPassword)}`;

  try {
    const response = await fetch(apiUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
    });

    const text = await response.text();

    if (response.ok) {
      return { success: true, message: text || "Đổi mật khẩu thành công" };
    } else {
      return { success: false, message: text || "Đổi mật khẩu thất bại" };
    }
  } catch (error) {
    console.error("❌ Lỗi khi đổi mật khẩu:", error);
    return { success: false, message: "Lỗi kết nối đến máy chủ" };
  }
};
export const getAccountById = async (accountId) => {
  const res = await axios.get(`${API_URL}/${accountId}/get`);
  return res.data;
};
export const updateAccount = async (accountId, accountDTO, imageFile) => {
  const formData = new FormData();
  for (const key in accountDTO) {
    if (accountDTO[key] !== undefined && accountDTO[key] !== null)
      formData.append(key, accountDTO[key]);
  }
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const res = await axios.put(`${API_URL}/update/${accountId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};