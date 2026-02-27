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
export default function ModeProtectedRoute({
  children,
  requiredMode,
  redirectTo,
}) {
  const { currentMode } = useMode();
  const { isHost, loading } = useAuth();

  // Esperar a que cargue la autenticación
  if (loading) return null;

  // Si requiere modo HOST pero el usuario no es host, redirigir
  if (requiredMode === MODES.HOST && !isHost) {
    return <Navigate to="/casas" replace />;
  }

  // Si el modo actual no coincide con el requerido, redirigir
  if (currentMode !== requiredMode) {
    // Determinar redirección según el modo ACTUAL del usuario
    const defaultRedirect = currentMode === MODES.GUEST
      ? "/"      // Si está en modo GUEST, ir a casas
      : "/mi-panel";  // Si está en modo HOST, ir al panel

    return <Navigate to={redirectTo || defaultRedirect} replace />;
  }

  // Todo bien, renderizar el componente
  return children;
}