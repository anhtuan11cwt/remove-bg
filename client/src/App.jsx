import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import MenuBar from "./components/MenuBar";
import Home from "./pages/Home";

function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <MenuBar />
      <Routes>
        <Route element={<Home />} path="/" />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
