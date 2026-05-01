import { SignedIn } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import MenuBar from "./components/MenuBar";
import UserSyncHandler from "./components/UserSyncHandler";
import BuyCredits from "./pages/BuyCredits";
import Home from "./pages/Home";
import PaymentSuccess from "./pages/PaymentSuccess";
import Result from "./pages/Result";

function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <UserSyncHandler />
      <MenuBar />
      <Routes>
        <Route element={<Home />} path="/" />
        <Route
          element={
            <SignedIn>
              <Result />
            </SignedIn>
          }
          path="/result"
        />
        <Route element={<PaymentSuccess />} path="/payment-success" />
        <Route element={<BuyCredits />} path="/pricing" />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
