import { plans } from "../assets/assets";

const Pricing = () => {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-12 font-bold text-3xl md:text-4xl">
        Chọn Gói Phù Hợp Với Bạn
      </h2>

      <div className="gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            className={`p-8 rounded-2xl relative transition ${
              plan.popular
                ? "border-2 border-indigo-600 shadow-xl scale-105"
                : "border border-gray-200 shadow-sm"
            }`}
            key={plan.name}
          >
            {plan.popular && (
              <span className="-top-3 left-1/2 absolute bg-indigo-600 px-3 py-1 rounded-full font-medium text-white text-xs -translate-x-1/2 transform">
                Phổ Biến Nhất
              </span>
            )}

            <h3 className="font-bold text-gray-800 text-xl">{plan.name}</h3>
            <p className="my-4 font-bold text-indigo-600 text-4xl">
              {plan.price}
            </p>
            <p className="text-gray-600">{plan.credits}</p>

            <button
              className="bg-linear-to-r from-purple-500 to-indigo-500 hover:opacity-90 mt-6 py-3 rounded-full w-full font-medium text-white transition"
              type="button"
            >
              Chọn Gói
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
