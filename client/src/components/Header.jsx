import { useContext } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Header = () => {
  const { removeBg } = useContext(AppContext);
  return (
    <div className="items-center gap-12 grid grid-cols-1 md:grid-cols-2 mb-16">
      {/* LEFT - BANNER IMAGE */}
      <div className="flex justify-center">
        <img
          alt="Xóa nền ảnh bằng AI"
          className="shadow-lg rounded-2xl w-full max-w-[400px] object-cover"
          src={assets.videoBanner}
        />
      </div>

      {/* RIGHT - TEXT */}
      <div>
        <h1 className="mb-6 font-bold text-4xl md:text-5xl">
          Xóa Nền Ảnh <span className="text-indigo-600">Ngay Lập Tức</span>
        </h1>

        <p className="mb-8 text-gray-600">
          Tải ảnh lên và để AI xóa nền trong vài giây với chất lượng tuyệt vời.
        </p>

        <input
          accept="image/*"
          hidden
          id="upload1"
          onChange={(e) => e.target.files[0] && removeBg(e.target.files[0])}
          type="file"
        />

        <label
          className="inline-block bg-black hover:opacity-80 px-8 py-4 rounded-full text-white transition cursor-pointer"
          htmlFor="upload1"
        >
          Tải Ảnh Của Bạn
        </label>
      </div>
    </div>
  );
};

export default Header;
