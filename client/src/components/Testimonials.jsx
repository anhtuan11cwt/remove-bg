import { testimonials } from "../assets/assets";

const Testimonials = () => {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-12 font-bold text-3xl md:text-4xl">
        Họ Yêu Thích Chúng Tôi, Bạn Cũng Sẽ Yêu Thích
      </h2>

      <div className="gap-8 grid grid-cols-1 md:grid-cols-3">
        {testimonials.map((t) => (
          <div
            className="bg-gray-50 shadow-sm p-6 rounded-2xl text-left"
            key={t.id}
          >
            {/* Quote Icon */}
            <svg
              aria-labelledby="quoteIcon"
              className="mb-4 w-8 h-8 text-indigo-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <title id="quoteIcon">Quote</title>
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>

            <p className="mb-4 text-gray-700 italic">&ldquo;{t.quote}&rdquo;</p>

            <div className="mt-auto">
              <h4 className="font-bold text-gray-900">{t.author}</h4>
              <span className="text-gray-500 text-sm">{t.handle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
