import { Routes, Route } from "react-router-dom";
import Home from "../pages/Landing/Home";
import About from "../pages/Landing/About";

export default function LandingRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
