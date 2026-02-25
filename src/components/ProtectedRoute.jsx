// requireAuth: true  → solo usuarios logueados
// requireAdmin: true → solo admins
// redirectTo: ruta a la que manda si no cumple

// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/login",
}) {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) return null;

  if (requireAuth && !isLoggedIn) return <Navigate to={redirectTo} replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return children;
}