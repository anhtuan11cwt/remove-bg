import { useAuth } from "@clerk/clerk-react";
import axios from "axios";
import { useState } from "react";
import { AppContext } from "./AppContext.js";

const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [credit, setCredit] = useState(false);

  const { getToken } = useAuth();

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

  const value = {
    backendUrl,
    credit,
    loadUserCredits,
    setCredit,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
