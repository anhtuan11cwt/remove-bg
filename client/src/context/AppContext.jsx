import { useAuth, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "./AppContext.js";

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [credit, setCredit] = useState(false);
  const [image, setImage] = useState(false);
  const [resultImage, setResultImage] = useState(false);

  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const loadUserCredits = async () => {
    try {
      const token = await getToken();
      const url = `${backendUrl}/users/credits`;

      const res = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        setCredit(res.data.data.credits);
      }
    } catch (error) {
      console.error("Lỗi tải tín dụng:", error);
    }
  };

  const removeBg = async (selectedImage) => {
    try {
      const token = await getToken();
      if (!token) {
        openSignIn();
        return;
      }

      setImage(selectedImage);
      setResultImage(false);
      navigate("/result");

      const formData = new FormData();
      formData.append("file", selectedImage);

      const { data } = await axios.post(
        `${backendUrl}/images/remove-background`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (data.success && data.data?.image) {
        setResultImage(`data:image/png;base64,${data.data.image}`);
      } else {
        toast.error("Lỗi: Cấu trúc response không hợp lệ");
      }
      setCredit((prev) => prev - 1);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xóa nền ảnh");
    }
  };

  const value = {
    backendUrl,
    credit,
    image,
    loadUserCredits,
    removeBg,
    resultImage,
    setCredit,
    setResultImage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
