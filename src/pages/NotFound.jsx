import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const [hoverHome, setHoverHome] = useState(false);
  const navigate = useNavigate();
  const handleGoHome = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-600 mb-2">
              404
            </div>
            <AlertCircle className="absolute -top-2 right-0 w-14 h-14 text-red-500 animate-bounce" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Trang không tìm thấy
        </h1>
        
        <p className="text-gray-400 mb-8 text-lg leading-relaxed">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>

        {/* Buttons */}
        <div className="space-y-3 mb-8">
          <button
            onClick={handleGoHome}
            onMouseEnter={() => setHoverHome(true)}
            onMouseLeave={() => setHoverHome(false)}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className={`w-5 h-5 transition ${hoverHome ? 'scale-110' : ''}`} />
            Về trang chủ
          </button>

          <button
            onClick={handleGoBack}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại trang trước
          </button>
        </div>

        {/* Decorative elements */}
        <div className="space-y-4">
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-pink-600 mx-auto rounded-full"></div>
          <p className="text-gray-500 text-sm">Mã lỗi: 404</p>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-pink-400 rounded-full animate-pulse opacity-50 delay-1000"></div>
      </div>
    </div>
  );
}