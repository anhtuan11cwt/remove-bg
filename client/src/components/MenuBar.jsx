import {
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { Coins, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const MenuBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [credit, setCredit] = useState(false);
  const navigate = useNavigate();
  const { openSignIn, openSignUp } = useClerk();
  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCredits = async () => {
      if (user) {
        const url = `${import.meta.env.VITE_BACKEND_URL}/users/credits`;

        try {
          const token = await getToken();
          const res = await fetch(url, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await res.json();
          setCredit(data.data?.credits || 0);
        } catch {
          setCredit(0);
        }
      }
    };

    fetchCredits();
  }, [user, getToken]);

  const openLogin = () => {
    openSignIn({});
    setMenuOpen(false);
  };

  const openRegister = () => {
    openSignUp({});
    setMenuOpen(false);
  };

  return (
    <nav className="relative flex justify-between items-center bg-white shadow-sm px-6 py-4">
      {/* TRÁI - Logo */}
      <Link className="flex items-center gap-2 cursor-pointer" to="/">
        <img alt="logo" className="w-8 h-8 object-contain" src={assets.logo} />
        <span className="font-semibold text-indigo-700 text-lg">
          remove<span className="text-gray-400">.bg</span>
        </span>
      </Link>

      {/* PHẢI - Nút Desktop */}
      <div className="hidden md:flex items-center gap-4">
        <SignedOut>
          <button
            className="font-medium text-gray-700 hover:text-blue-500 transition"
            onClick={openLogin}
            type="button"
          >
            Đăng nhập
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-gray-700 transition"
            onClick={openRegister}
            type="button"
          >
            Đăng ký
          </button>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 bg-transparent p-0 border-none hover:text-indigo-600 text-sm transition cursor-pointer"
              onClick={() => navigate("/pricing")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  navigate("/pricing");
                }
              }}
              type="button"
            >
              <Coins className="w-4 h-4 text-yellow-500" />
              Tín dụng: {credit !== false ? credit : "..."}
            </button>
            <p className="font-medium text-sm">Xin chào, {user?.fullName}</p>
            <UserButton />
          </div>
        </SignedIn>
      </div>

      {/* MOBILE - Nút Hamburger */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} type="button">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE - Menu Thả Xuống */}
      {menuOpen && (
        <div className="top-16 right-6 absolute flex flex-col gap-3 bg-white shadow-lg p-4 rounded-xl w-48">
          <SignedOut>
            <button
              className="font-medium text-gray-700 hover:text-blue-500"
              onClick={openLogin}
              type="button"
            >
              Đăng nhập
            </button>
            <button
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-gray-700"
              onClick={openRegister}
              type="button"
            >
              Đăng ký
            </button>
          </SignedOut>
          <SignedIn>
            <div className="flex flex-col gap-3">
              <button
                className="flex items-center gap-1 bg-transparent p-0 border-none hover:text-indigo-600 text-sm transition cursor-pointer"
                onClick={() => {
                  navigate("/pricing");
                  setMenuOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate("/pricing");
                    setMenuOpen(false);
                  }
                }}
                type="button"
              >
                <Coins className="w-4 h-4 text-yellow-500" />
                Tín dụng: {credit !== false ? credit : "..."}
              </button>
              <p className="font-medium text-sm">{user?.fullName}</p>
              <UserButton />
            </div>
          </SignedIn>
        </div>
      )}
    </nav>
  );
};

export default MenuBar;
