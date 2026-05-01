import { SignedIn } from "@clerk/clerk-react";
import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import MenuBar from "./components/MenuBar";
import UserSyncHandler from "./components/UserSyncHandler";
import Home from "./pages/Home";
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
