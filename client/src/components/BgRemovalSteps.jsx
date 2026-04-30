import { steps } from "../assets/assets";

const BgRemovalSteps = () => {
  return (
    <div className="mb-16 text-center">
      <h2 className="mb-12 font-bold text-3xl md:text-4xl">
        Cách Thức Hoạt Động
      </h2>

      <div className="gap-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {steps.map((item) => (
          <div className="bg-gray-50 shadow-sm p-8 rounded-2xl" key={item.step}>
            <span className="bg-indigo-100 px-3 py-1 rounded-full font-medium text-indigo-700 text-sm">
              {item.step}
            </span>

            <h3 className="mt-4 mb-2 font-bold text-xl">{item.title}</h3>

            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BgRemovalSteps;
