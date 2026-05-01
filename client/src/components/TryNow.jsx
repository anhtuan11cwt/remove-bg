import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const TryNow = () => {
  const { removeBg } = useContext(AppContext);
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-4 font-bold text-3xl md:text-4xl">Xóa Nền Ảnh</h2>

      <p className="mb-8 text-gray-600 text-lg">
        Dùng thử miễn phí ngay. Không cần đăng ký.
      </p>

      <input
        accept="image/*"
        hidden
        id="upload2"
        onChange={(e) => e.target.files[0] && removeBg(e.target.files[0])}
        type="file"
      />

      <label
        className="inline-block bg-black hover:opacity-80 px-8 py-4 rounded-full text-white transition cursor-pointer"
        htmlFor="upload2"
      >
        Tải Ảnh Lên
      </label>

      <p className="mt-4 text-gray-500 text-sm">
        Hoặc thả file, dán ảnh hoặc URL
      </p>
    </div>
  );
};

export default TryNow;
