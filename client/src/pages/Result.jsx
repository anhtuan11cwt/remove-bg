import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Result = () => {
  const { image, resultImage } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="mx-auto px-4 py-12 max-w-6xl">
      <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
        {/* Cột trái - Ảnh gốc */}
        <div>
          <h2 className="mb-4 font-semibold text-xl">Ảnh gốc</h2>
          {image && (
            <img
              alt="original"
              className="shadow-lg rounded-lg w-full"
              src={URL.createObjectURL(image)}
            />
          )}
        </div>

        {/* Cột phải - Ảnh đã xóa nền */}
        <div>
          <h2 className="mb-4 font-semibold text-xl">Ảnh đã xóa nền</h2>
          <div className="relative bg-gray-50 rounded-lg min-h-[300px]">
            {/* Loading spinner khi chưa có kết quả */}
            {!resultImage && (
              <div className="absolute inset-0 flex justify-center items-center">
                <div className="border-4 border-gray-300 border-t-black rounded-full w-10 h-10 animate-spin" />
              </div>
            )}

            {/* Hiển thị ảnh kết quả */}
            {resultImage && (
              <img
                alt="result"
                className="shadow-lg rounded-lg w-full"
                src={resultImage}
              />
            )}
          </div>
        </div>
      </div>

      {/* Buttons - chỉ hiển thị khi có kết quả */}
      {resultImage && (
        <div className="flex justify-center gap-4 mt-8">
          <button
            className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-full font-medium transition cursor-pointer"
            onClick={() => navigate("/")}
            type="button"
          >
            Thử ảnh khác
          </button>

          <a
            className="inline-block bg-black hover:opacity-80 px-6 py-3 rounded-full font-medium text-white transition cursor-pointer"
            download="no-bg.png"
            href={resultImage}
          >
            Tải ảnh xuống
          </a>
        </div>
      )}
    </div>
  );
};

export default Result;
