import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AppContext } from "../context/AppContext.js";

const UserSyncHandler = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  const { backendUrl, loadUserCredits } = useContext(AppContext);

  const [synced, setSynced] = useState(false);

  useEffect(() => {
    const syncUser = async () => {
      try {
        const token = await getToken();
        const requestUrl = `${backendUrl}/users`;

        await axios.post(
          requestUrl,
          {
            clerkId: user.id,
            email: user.primaryEmailAddress?.emailAddress,
            firstName: user.firstName,
            lastName: user.lastName,
            photoUrl: user.imageUrl,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        toast.success("Đồng bộ người dùng thành công");
        setSynced(true);
        loadUserCredits();
      } catch {
        toast.error("Đồng bộ người dùng thất bại");
      }
    };

    if (isLoaded && isSignedIn && user && !synced) {
      syncUser();
    }
  }, [
    isLoaded,
    isSignedIn,
    user,
    synced,
    backendUrl,
    getToken,
    loadUserCredits,
  ]);

  return null;
};

export default UserSyncHandler;
