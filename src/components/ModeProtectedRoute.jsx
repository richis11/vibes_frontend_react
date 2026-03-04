import { Navigate } from "react-router-dom";
import { useMode, MODES } from "../context/ModeContext";
import { useAuth } from "../context/AuthContext";

/**
 * Componente para proteger rutas según el modo activo del usuario
 * 
 * @param {React.ReactNode} children - Componente hijo a renderizar
 * @param {string} requiredMode - Modo requerido: MODES.GUEST o MODES.HOST
 * @param {string} redirectTo - Ruta a la que redirigir si no cumple (opcional)
 */
export default function ModeProtectedRoute({ children, requiredMode, redirectTo }) {
  const { currentMode } = useMode();
  const { isHost, loading } = useAuth();

  if (loading) return null;

  // Rutas HOST: requiere ser host Y estar en modo host
  if (requiredMode === MODES.HOST) {
    if (!isHost) return <Navigate to="/casas" replace />;
    if (currentMode !== MODES.HOST) return <Navigate to={redirectTo || "/casas"} replace />;
    return children;
  }

  // Rutas GUEST: si el usuario NO es host, siempre puede acceder (no tiene modo)
  // Si ES host, solo puede acceder si está en modo guest
  if (requiredMode === MODES.GUEST) {
    if (isHost && currentMode !== MODES.GUEST) {
      return <Navigate to={redirectTo || "/mi-panel"} replace />;
    }
    return children; // ✅ no-host siempre pasa, host en guest mode también pasa
  }

  return children;
}