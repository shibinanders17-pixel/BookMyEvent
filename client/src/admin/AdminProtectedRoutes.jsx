import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes = () => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) return <Navigate to="/admin/login" />;
  return <Outlet />;
};

export default AdminProtectedRoutes;