import { Routes, Route } from "react-router-dom";
import Home from "../pages/Landing/Home";
import LandingLayout from "../components/LandingLayout";
export default function LandingRoutes() {
  return (
    <LandingLayout>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </LandingLayout>
  );
}
