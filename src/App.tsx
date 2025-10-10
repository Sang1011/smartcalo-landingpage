import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingRoutes from "./routes/LandingRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Login from "./pages/Admin/Login";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <Routes>

        {/* Trang quản trị (cần login) */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Trang login admin */}
        <Route path="/admin/login" element={<Login />} />

        {/* Khách (landing page) */}
        <Route path="/*" element={<LandingRoutes />} />

        {/* Trang không tìm thấy */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
