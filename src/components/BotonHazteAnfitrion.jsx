import { useState } from "react";

export default function BotonHazteAnfitrion({ onOpenModal }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onOpenModal}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered
          ? "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)"
          : "transparent",
        border: "1.5px solid rgba(0,180,230,0.4)",
        color: hovered ? "#fff" : "#0090c8",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        padding: "8px 16px",
        borderRadius: 10,
        transition: "all 0.2s",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        gap: 6,
        boxShadow: hovered ? "0 4px 16px rgba(0,180,230,0.25)" : "none",
      }}
    >
      <span style={{ fontSize: 16 }}>🏠</span>
      Hazte Anfitrión
    </button>
  );
}
