import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export function ProtectedRoute({ admin = false }: { admin?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <main className="center-screen">Loading...</main>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && !["admin", "teacher"].includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
