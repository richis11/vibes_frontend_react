import { useState } from "react";
import useCasas from "../hooks/useCasas";
import { useNavigate } from "react-router-dom";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80";

const badgeDisponibilidad = {
  disponible: {
    label: "Disponible",
    color: "#00b4e6",
    bg: "rgba(0,180,230,0.12)",
  },
  ocupada: { label: "Ocupada", color: "#f97316", bg: "rgba(249,115,22,0.12)" },
  mantenimiento: {
    label: "Mantenimiento",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
  },
};

function BadgeDisp({ disponibilidad }) {
  const d = badgeDisponibilidad[disponibilidad] ?? {
    label: disponibilidad,
    color: "#666",
    bg: "#eee",
  };
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 99,
        color: d.color,
        background: d.bg,
        letterSpacing: "0.04em",
      }}
    >
      {d.label}
    </span>
  );
}

function CasaCard({ casa }) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: hovered
          ? "0 16px 48px rgba(0,150,210,0.22)"
          : "0 4px 20px rgba(0,140,190,0.10)",
        transform: hovered ? "translateY(-5px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(.22,1,.36,1)",
        display: "flex",
        flexDirection: "column",
        border: "1.5px solid rgba(0,180,230,0.10)",
      }}
    >
      {/* Imagen */}
      <div
        style={{
          position: "relative",
          height: 200,
          overflow: "hidden",
          background: "#e8f6ff",
        }}
      >
        <img
          src={imgError ? IMAGEN_GENERICA : casa.foto_url || IMAGEN_GENERICA}
          alt={casa.nombre}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.35s ease",
          }}
        />
        {/* Overlay precio */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "rgba(0,20,40,0.72)",
            backdropFilter: "blur(6px)",
            borderRadius: 10,
            padding: "6px 12px",
            color: "#fff",
          }}
        >
          <span style={{ fontSize: 11, opacity: 0.75 }}>desde </span>
          <span style={{ fontSize: 17, fontWeight: 800 }}>
            ${parseFloat(casa.precio).toFixed(0)}
          </span>
          <span style={{ fontSize: 11, opacity: 0.75 }}> /noche</span>
        </div>
        {/* Badge disponibilidad */}
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <BadgeDisp disponibilidad={casa.disponibilidad} />
        </div>
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: "18px 20px 20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: "#002d44",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {casa.nombre}
        </h3>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            color: "#5aabb8",
            fontSize: 13,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {casa.direccion}
          </span>
        </div>

        {casa.descripcion && (
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#6b8fa3",
              lineHeight: 1.55,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {casa.descripcion}
          </p>
        )}

        {/* Botón */}
        <button
        onClick={() => navigate(`/casas/${casa.id}`)}
          style={{
            marginTop: "auto",
            paddingTop: 10,
            border: "none",
            borderRadius: 10,
            padding: "10px 0",
            width: "100%",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.2s",
            background:
              casa.disponibilidad === "disponible"
                ? "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)"
                : "rgba(0,0,0,0.06)",
            color: casa.disponibilidad === "disponible" ? "#fff" : "#aaa",
            boxShadow:
              casa.disponibilidad === "disponible"
                ? "0 4px 14px rgba(0,180,230,0.35)"
                : "none",
          }}
          disabled={casa.disponibilidad !== "disponible"}
        >
          {casa.disponibilidad === "disponible"
            ? "Ver detalles"
            : "No disponible"}
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton loader ──────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        borderRadius: 18,
        overflow: "hidden",
        border: "1.5px solid rgba(0,180,230,0.10)",
        background: "#fff",
        boxShadow: "0 4px 20px rgba(0,140,190,0.08)",
      }}
    >
      <div
        style={{
          height: 200,
          background:
            "linear-gradient(90deg, #e8f6ff 25%, #d0eefa 50%, #e8f6ff 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      <div
        style={{
          padding: "18px 20px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[90, 60, 100, 40].map((w, i) => (
          <div
            key={i}
            style={{
              height: i === 3 ? 36 : 14,
              width: `${w}%`,
              borderRadius: 8,
              background:
                "linear-gradient(90deg, #e8f6ff 25%, #d0eefa 50%, #e8f6ff 75%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Vitrina_casas() {
  const { casas, loading, error } = useCasas();
  const [busqueda, setBusqueda] = useState("");
  const [filtroDisp, setFiltroDisp] = useState("todas");

  // Filtrar solo activas + aplicar filtros del usuario
  const casasFiltradas = casas
    .filter((c) => c.estado === "activa")
    .filter((c) => filtroDisp === "todas" || c.disponibilidad === filtroDisp)
    .filter(
      (c) =>
        busqueda.trim() === "" ||
        c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        c.direccion.toLowerCase().includes(busqueda.toLowerCase()) ||
        (c.descripcion ?? "").toLowerCase().includes(busqueda.toLowerCase()),
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .vitrina-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 24px;
        }
        .vitrina-card-wrapper { animation: fadeUp 0.4s ease both; }
        .vitrina-card-wrapper:nth-child(1){animation-delay:0.05s}
        .vitrina-card-wrapper:nth-child(2){animation-delay:0.1s}
        .vitrina-card-wrapper:nth-child(3){animation-delay:0.15s}
        .vitrina-card-wrapper:nth-child(4){animation-delay:0.2s}
        .vitrina-card-wrapper:nth-child(5){animation-delay:0.25s}
        .vitrina-card-wrapper:nth-child(6){animation-delay:0.3s}
        .search-input:focus { outline: none; border-color: #00b4e6 !important; box-shadow: 0 0 0 3px rgba(0,180,230,0.14); }
        .filtro-btn { transition: all 0.18s; }
        .filtro-btn:hover { transform: translateY(-1px); }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          paddingTop: 80,
          paddingBottom: 48,
          background: "linear-gradient(180deg, #edfaff 0%, #f5feff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#00b4e6",
                textTransform: "uppercase",
              }}
            >
              Explora nuestros espacios
            </span>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(26px, 4vw, 40px)",
                fontWeight: 800,
                color: "#002d44",
                margin: "8px 0 6px",
                letterSpacing: "-0.02em",
              }}
            >
              Encuentra tu lugar ideal
            </h1>
            <p
              style={{
                color: "#5aabb8",
                fontSize: 15,
                maxWidth: 480,
                margin: "0 auto",
              }}
            >
              Casas únicas para experiencias inolvidables
            </p>
          </div>

          {/* Buscador + filtros */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              marginBottom: 32,
              justifyContent: "center",
            }}
          >
            {/* Buscador */}
            <div
              style={{ position: "relative", flex: "1 1 280px", maxWidth: 420 }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#00b4e6"
                strokeWidth="2.2"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="search-input"
                type="text"
                placeholder="Buscar por nombre, ciudad..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{
                  width: "100%",
                  padding: "11px 14px 11px 40px",
                  fontSize: 14,
                  borderRadius: 12,
                  border: "1.5px solid rgba(0,180,230,0.25)",
                  background: "#fff",
                  color: "#003a56",
                  fontFamily: "inherit",
                  boxSizing: "border-box",
                  transition: "all 0.2s",
                }}
              />
            </div>

            {/* Filtros disponibilidad */}
            {["todas", "disponible", "ocupada", "mantenimiento"].map((f) => (
              <button
                key={f}
                className="filtro-btn"
                onClick={() => setFiltroDisp(f)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  border: "1.5px solid",
                  fontFamily: "'DM Sans', sans-serif",
                  borderColor:
                    filtroDisp === f ? "#00b4e6" : "rgba(0,180,230,0.2)",
                  background:
                    filtroDisp === f
                      ? "linear-gradient(135deg, #00c6f0, #0090c8)"
                      : "#fff",
                  color: filtroDisp === f ? "#fff" : "#5aabb8",
                  boxShadow:
                    filtroDisp === f
                      ? "0 4px 14px rgba(0,180,230,0.3)"
                      : "none",
                }}
              >
                {f === "todas"
                  ? "Todas"
                  : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Contador */}
          {!loading && (
            <p
              style={{
                color: "#8bb8c8",
                fontSize: 13,
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              {casasFiltradas.length === 0
                ? "No se encontraron casas"
                : `${casasFiltradas.length} ${casasFiltradas.length === 1 ? "casa encontrada" : "casas encontradas"}`}
            </p>
          )}

          {/* Error */}
          {error && (
            <div style={{ textAlign: "center", padding: 40, color: "#ef4444" }}>
              <p>{error}</p>
            </div>
          )}

          {/* Grid */}
          <div className="vitrina-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : casasFiltradas.map((casa) => (
                  <div key={casa.id} className="vitrina-card-wrapper">
                    <CasaCard casa={casa} />
                  </div>
                ))}
          </div>

          {/* Empty state */}
          {!loading && !error && casasFiltradas.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏠</div>
              <h3
                style={{
                  fontFamily: "'Syne',sans-serif",
                  color: "#002d44",
                  marginBottom: 8,
                }}
              >
                No encontramos casas
              </h3>
              <p style={{ color: "#5aabb8", fontSize: 14 }}>
                Intenta con otro término o limpia los filtros
              </p>
              <button
                onClick={() => {
                  setBusqueda("");
                  setFiltroDisp("todas");
                }}
                style={{
                  marginTop: 16,
                  padding: "10px 24px",
                  borderRadius: 10,
                  border: "none",
                  background: "linear-gradient(135deg, #00c6f0, #0090c8)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
