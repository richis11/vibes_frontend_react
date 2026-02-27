import { useMode, MODES } from "../context/ModeContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ModeToggle() {
  const { currentMode, switchToGuest, switchToHost } = useMode();
  const { isHost } = useAuth();
  const navigate = useNavigate();

  // Si el usuario no es host, no mostrar el toggle
  if (!isHost) return null;

  const handleToggle = () => {
    if (currentMode == MODES.GUEST) {
      switchToHost();
navigate("/mi-panel"); // Redirigir a panel de anfitrión
    } else {
      switchToGuest();
      navigate("/casas"); // Redirigir a casas (cliente)
    }
  };

  return (
    <button
      onClick={handleToggle}
      style={{
        background: "none",
        border: "none",
        color: "#5aabb8",
        fontSize: 15,
        fontWeight: 500,
        cursor: "pointer",
        padding: "8px 12px",
        borderRadius: 8,
        transition: "all 0.2s",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(0,180,230,0.08)";
        e.currentTarget.style.color = "#0090c8";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
        e.currentTarget.style.color = "#5aabb8";
      }}
    >
      {/* <span style={{ fontSize: 16 }}>
        {currentMode === MODES.GUEST ? "🏠" : "🏖️"}
      </span> */}
      {currentMode === MODES.GUEST ? "Modo Anfitrión" : "Modo Cliente"}
    </button>
  );
}
