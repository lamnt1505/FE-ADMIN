import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { setAuth } from "../utils/auth";
import { User, Lock, RefreshCcw, Eye, EyeOff } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import bgImage from '../images/1658744518_e-commerce-executive-careerbuilder.jpg';
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [accountName, setAccountName] = useState("");
  const [accountPass, setAccountPass] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaUrl, setCaptchaUrl] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const refreshCaptcha = async () => {
    try {
      const res = await api.get("/account/captcha", {
        method: "GET",
        credentials: "include", // 🔥 bắt buộc
      });
      const imgUrl = URL.createObjectURL(res.data);
      setCaptchaUrl(imgUrl);
    } catch (err) {
      console.error("Lỗi captcha:", err);
    }
  };

  useEffect(() => {
    refreshCaptcha();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post(
        "/account/login",
        { accountName, accountPass, captcha },
        { withCredentials: true } 
      );

      const data = res.data;

      if (data.isCaptchaValid === false) {
        setError("Captcha không hợp lệ. Vui lòng thử lại.");
        refreshCaptcha();
        setCaptcha("");
        return;
      }

      if (data.success) {
        localStorage.setItem("accountName", accountName);
        let role = "USER";
        if (data.isAdmin) role = "ADMIN";
        else if (data.isEmployee) role = "EMPLOYEE";

        setAuth({
          isLoggedIn: true,
          role,
          accountName: data.accountName,
          accountID: data.accountID,
        });

        localStorage.setItem(
          "account",
          JSON.stringify({
            isLoggedIn: true,
            role,
            accountName: data.accountName,
            accountID: data.accountID,
          })
        );

        localStorage.setItem("accountId", data.accountID);

        if (role === "ADMIN" || role === "EMPLOYEE") {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      } else {
        setError(data.message || "Đăng nhập thất bại");
        refreshCaptcha();
        setCaptcha("");
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(
          err.response.data.message || "Sai tên đăng nhập hoặc mật khẩu!"
        );
        toast.error(err.response.data.message || "Đăng nhập thất bại");
      } else {
        setError("Lỗi hệ thống hoặc API chưa chạy");
      }
      refreshCaptcha();
      setCaptcha("");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-lg bg-white/90 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <img
            src="../images/e-commerce.jpg"
            alt="banner"
            className="w-40 h-40 object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          ĐĂNG NHẬP
        </h2>
        {error && (
          <div className="text-red-600 text-sm text-center mb-4">{error}</div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border rounded-lg px-3 py-2">
            <User className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="TÊN ĐĂNG NHẬP"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              className="w-full bg-transparent outline-none"
              required
            />
          </div>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="MẬT KHẨU"
              value={accountPass}
              onChange={(e) => setAccountPass(e.target.value)}
              className="w-full bg-transparent outline-none"
              required
            />
                        <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-500 hover:text-gray-700 ml-2 focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div>
            
            <div className="flex items-center justify-between mb-2">
              
              <img
                src={captchaUrl}
                alt="captcha"
                className="h-12 border rounded-lg cursor-pointer"
                onClick={refreshCaptcha}
                crossOrigin="use-credentials"
              />
              <button
                type="button"
                onClick={refreshCaptcha}
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
              >
                <RefreshCcw className="w-4 h-4" /> Tải lại mã
              </button>
            </div>
            <input
              type="text"
              placeholder="NHẬP MÃ CAPTCHA"
              value={captcha}
              onChange={(e) => setCaptcha(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            
            ĐĂNG NHẬP
          </button>
        </form>
        <div className="flex justify-between mt-4"> </div>
      </div>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
            />
    </div>
  );
}
