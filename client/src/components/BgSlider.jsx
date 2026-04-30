import { useState } from "react";
import { assets, categories } from "../assets/assets";

const BgSlider = () => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeCategory, setActiveCategory] = useState("people");

  const handleSliderChange = (e) => {
    setSliderPosition(e.target.value);
  };

  return (
    <div className="mb-16">
      <h2 className="mb-8 font-bold text-3xl md:text-4xl text-center">
        Chất Lượng Tuyệt Vời
      </h2>

      {/* Category Selector */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {categories.map((cat) => (
          <button
            className={`px-4 py-2 rounded-full capitalize transition ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            key={cat}
            onClick={() => setActiveCategory(cat)}
            type="button"
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Image Comparison Slider */}
      <div className="relative shadow-lg mx-auto rounded-2xl max-w-3xl overflow-hidden">
        {/* Original Image (Background) */}
        <img
          alt="Original"
          className="w-full h-auto"
          src={assets.beforeImage}
        />

        {/* Processed Image (Foreground with clip-path) */}
        <img
          alt="Background Removed"
          className="top-0 left-0 absolute w-full h-full object-cover"
          src={assets.afterImage}
          style={{
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
          }}
        />

        {/* Slider Input */}
        <input
          className="right-4 bottom-4 left-4 absolute w-auto slider-thumb"
          max="100"
          min="0"
          onChange={handleSliderChange}
          type="range"
          value={sliderPosition}
        />
      </div>
    </div>
  );
};

export default BgSlider;
