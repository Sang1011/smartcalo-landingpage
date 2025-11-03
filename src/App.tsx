import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingRoutes from "./routes/LandingRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Admin/Login";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";

function App() {
  return (
    <Router>
      <Routes>

        {/* 1. Trang login admin: PHẢI ĐẶT TRƯỚC /admin/* */}
        <Route path="/admin/login" element={<Login />} /> 

        {/* 2. Trang quản trị (cần login): BẮT CÁC ROUTE CÒN LẠI */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="/privacy" element={<Privacy />} />

        {/* Khách (landing page) */}
        <Route path="/*" element={<LandingRoutes />} />


        {/* Trang không tìm thấy */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
