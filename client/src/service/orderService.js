import axios from "axios";
import toast from "react-hot-toast";

export const placeOrder = async ({
  planId,
  clerkId,
  getToken,
  backendUrl,
  onSuccess,
}) => {
  try {
    const token = await getToken();

    const response = await axios.post(
      `${backendUrl}/orders?planId=${planId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          clerkId: clerkId,
        },
      },
    );

    if (response.status === 201 || response.status === 200) {
      // Redirect to Stripe Checkout URL
      const checkoutUrl = response.data.data?.url;
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        toast.error("Không tìm thấy URL thanh toán");
      }
      if (onSuccess) {
        onSuccess();
      }
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || error.message || "Lỗi khi tạo đơn hàng",
    );
  }
};

export const verifyPayment = async (sessionId, getToken, backendUrl) => {
  const token = await getToken();

  const verifyRes = await axios.post(
    `${backendUrl}/orders/verify`,
    { sessionId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return verifyRes.data;
};
