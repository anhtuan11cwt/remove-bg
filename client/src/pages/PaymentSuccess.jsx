import { Check, Home, Sparkles } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { loadUserCredits } = useContext(AppContext);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    loadUserCredits();
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, [loadUserCredits]);

  return (
    <div className="flex justify-center items-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="w-full max-w-md">
        <div
          className={`text-center space-y-6 transform transition-all duration-700 ${isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-green-200 opacity-20 rounded-full animate-ping" />
            <div className="relative bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl p-8 border border-green-100 rounded-full">
              <div className="relative flex justify-center items-center">
                <Sparkles className="-top-2 -right-2 absolute w-6 h-6 text-yellow-500 animate-pulse" />
                <Check
                  aria-hidden="true"
                  className="w-12 h-12 text-green-600"
                  strokeWidth={3}
                />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 font-bold text-gray-900 text-transparent text-3xl">
              Thanh toán thành công!
            </h1>
            <p className="text-gray-600 text-lg">
              Credits đã được thêm vào tài khoản của bạn.
            </p>
            <div className="bg-green-50 p-4 border border-green-100 rounded-lg">
              <p className="font-medium text-green-700 text-sm">
                ✨ Sẵn sàng để sử dụng ngay bây giờ!
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              className="flex justify-center items-center gap-2 bg-gradient-to-r from-indigo-600 hover:from-indigo-700 to-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl px-6 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 w-full font-semibold text-white hover:scale-105 transition-all duration-200 transform"
              onClick={() => navigate("/")}
              type="button"
            >
              <Home className="w-5 h-5" />
              Tiếp tục sử dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
