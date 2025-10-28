import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../components/AdminLayout";
import Dashboard from "../pages/Admin/Dashboard";
import UserManagement from "../pages/Admin/UserManagement";
import RecipeManagement from "../pages/Admin/RecipeManagement";
import ExercisesManagement from "../pages/Admin/ExercisesManagement";
import NotFound from "../pages/NotFound";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/recipes" element={<RecipeManagement />} />
        <Route path="/exercises" element={<ExercisesManagement />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
