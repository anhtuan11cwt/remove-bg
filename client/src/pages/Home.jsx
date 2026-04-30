import BgRemovalSteps from "../components/BgRemovalSteps";
import BgSlider from "../components/BgSlider";
import Header from "../components/Header";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import TryNow from "../components/TryNow";

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-[Outfit]">
      {/* Hero Section */}
      <Header />

      {/* Steps */}
      <BgRemovalSteps />

      {/* Slider */}
      <BgSlider />

      {/* Pricing */}
      <Pricing />

      {/* Testimonials */}
      <Testimonials />

      {/* Try Now */}
      <TryNow />
    </div>
  );
};

export default Home;
