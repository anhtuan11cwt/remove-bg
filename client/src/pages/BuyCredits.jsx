import { useClerk, useUser } from "@clerk/clerk-react";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { placeOrder } from "../service/orderService";

const BuyCredits = () => {
  const { isSignedIn, user } = useUser();
  const { openSignIn, session } = useClerk();
  const { backendUrl, loadUserCredits } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const handleOrder = async (planId) => {
    try {
      if (!isSignedIn) {
        openSignIn();
        return;
      }

      if (loading) return;
      setLoading(true);

      await placeOrder({
        backendUrl,
        clerkId: user?.id,
        getToken: () => session.getToken(),
        onSuccess: loadUserCredits,
        planId,
      });
    } catch {
      toast.error("Có lỗi xảy ra khi xử lý đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="mx-auto px-4 max-w-6xl">
        <h1 className="mb-4 font-bold text-4xl text-center">
          Chọn gói phù hợp với bạn
        </h1>
        <p className="mb-12 text-gray-600 text-center">
          Chọn gói tín dụng hoàn hảo cho nhu cầu xóa nền của bạn
        </p>

        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              className={`p-8 rounded-2xl relative transition ${
                plan.popular
                  ? "border-2 border-indigo-600 shadow-xl scale-105"
                  : "border border-gray-200 shadow-sm"
              }`}
              key={plan.name}
            >
              {plan.popular && (
                <span className="-top-3 left-1/2 absolute bg-indigo-600 px-3 py-1 rounded-full font-medium text-white text-xs -translate-x-1/2 transform">
                  Phổ Biến Nhất
                </span>
              )}

              <h3 className="font-bold text-gray-800 text-xl">{plan.name}</h3>
              <p className="my-4 font-bold text-indigo-600 text-4xl">
                {plan.price}
              </p>
              <p className="text-gray-600">{plan.credits}</p>

              <button
                className="bg-linear-to-r from-purple-500 to-indigo-500 hover:opacity-90 disabled:opacity-50 mt-6 py-3 rounded-full w-full font-medium text-white transition disabled:cursor-not-allowed"
                disabled={loading}
                onClick={() => handleOrder(plan.planId)}
                type="button"
              >
                {loading ? "Đang xử lý..." : "Chọn Gói"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuyCredits;
