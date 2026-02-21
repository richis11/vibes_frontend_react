import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";

// requireAuth: true  → solo usuarios logueados
// requireAdmin: true → solo admins
// redirectTo: ruta a la que manda si no cumple

export default function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
  redirectTo = "/login",
}) {
  const { isLoggedIn, isAdmin, loading } = useAuth();

  if (loading) return null; // esperar a que se lea el storage

  if (requireAuth && !isLoggedIn) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;

  return children;
}