import { Menu, X } from "lucide-react";
import { useState } from "react";
import { assets } from "../assets/assets";

const MenuBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative flex justify-between items-center bg-white shadow-sm px-6 py-4">
      {/* LEFT - Logo */}
      <div className="flex items-center gap-2 cursor-pointer">
        <img alt="logo" className="w-8 h-8 object-contain" src={assets.logo} />
        <span className="font-semibold text-indigo-700 text-lg">
          remove<span className="text-gray-400">.bg</span>
        </span>
      </div>

      {/* RIGHT - Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4">
        <button
          className="font-medium text-gray-700 hover:text-blue-500 transition"
          type="button"
        >
          Đăng nhập
        </button>
        <button
          className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-gray-700 transition"
          type="button"
        >
          Đăng ký
        </button>
      </div>

      {/* MOBILE - Hamburger Button */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} type="button">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* MOBILE - Dropdown Menu */}
      {menuOpen && (
        <div className="top-16 right-6 absolute flex flex-col gap-3 bg-white shadow-lg p-4 rounded-xl w-40">
          <button
            className="font-medium text-gray-700 hover:text-blue-500"
            type="button"
          >
            Đăng nhập
          </button>
          <button
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-full font-medium text-gray-700"
            type="button"
          >
            Đăng ký
          </button>
        </div>
      )}
    </nav>
  );
};

export default MenuBar;
