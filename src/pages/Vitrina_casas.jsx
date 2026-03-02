import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import useCasasConImagen from "../hooks/useCasasConImagen";

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

const FILTROS = [
  { key: "todas", label: "Todas" },
  { key: "disponible", label: "Disponible" },
  { key: "ocupada", label: "Ocupada" },
  { key: "mantenimiento", label: "Mantenimiento" },
];

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
      onClick={() => navigate(`/casas/${casa.id}`)}
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
        border: `1.5px solid ${hovered ? "rgba(0,180,230,0.30)" : "rgba(0,180,230,0.10)"}`,
        cursor: "pointer",
        
      }}
    >
      <div
        style={{
          position: "relative",
          height: 200,
          overflow: "hidden",
          background: "#e8f6ff",
        }}
      >
        <img
          src={imgError ? IMAGEN_GENERICA : casa.imagen_principal || IMAGEN_GENERICA}
          alt={casa.nombre}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.4s cubic-bezier(.22,1,.36,1)",
          }}
        />
        <div style={{ position: "absolute", top: 12, left: 12 }}>
          <BadgeDisp disponibilidad={casa.disponibilidad} />
        </div>
      </div>

      <div
        style={{
          padding: "16px 18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 8,
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 16,
            fontWeight: 700,
            color: "#002d44",
            fontFamily: "'Syne', sans-serif",
            lineHeight: 1.3,
          }}
        >
          {casa.nombre}
        </h3>

        <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#0090c8" }}>
            ${parseFloat(casa.precio).toFixed(2)}
          </span>
          <span style={{ fontSize: 13, color: "#8bb8c8", fontWeight: 400 }}>
            / noche
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 13 }}>📍</span>
          <span
            style={{
              fontSize: 13,
              color: "#6b8fa3",
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

        {casa.disponibilidad !== "disponible" && (
          <p
            style={{
              margin: "6px 0 0",
              fontSize: 12,
              color: "#bbb",
              fontWeight: 600,
            }}
          >
            No disponible para reservas
          </p>
        )}
      </div>
    </div>
  );
}

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
              height: 14,
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

// ─── Dropdown de filtro para móvil ────────────────────────────────────────
function FiltroDropdown({ filtroDisp, setFiltroDisp }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFiltered = filtroDisp !== "todas";

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1000, }}>
      {/* Botón trigger — solo ícono, compacto */}
      <button
        onClick={() => setOpen((p) => !p)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 34,
          height: 34,
          borderRadius: 9,
          border: `1.5px solid ${isFiltered ? "#00b4e6" : "rgba(0,180,230,0.3)"}`,
          background: isFiltered ? "#00b4e6" : "transparent",
          color: isFiltered ? "#fff" : "#00b4e6",
          cursor: "pointer",
          transition: "all 0.18s",
          padding: 0,
          position: "relative",
        }}
        title="Filtrar"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        {/* Punto indicador cuando hay filtro activo */}
        {isFiltered && (
          <span style={{
            position: "absolute",
            top: -4,
            right: -4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#f97316",
            border: "1.5px solid #fff",
          }} />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            background: "#fff",
            borderRadius: 14,
            border: "1.5px solid rgba(0,180,230,0.15)",
            boxShadow: "0 8px 32px rgba(0,100,160,0.14)",
            overflow: "hidden",
            minWidth: 170,
            
            animation: "dropIn 0.16s cubic-bezier(.22,1,.36,1) both",
          }}
        >
          {FILTROS.map((f, i) => {
            const selected = filtroDisp === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setFiltroDisp(f.key);
                  setOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "11px 14px",
                  border: "none",
                  borderBottom: i < FILTROS.length - 1 ? "1px solid rgba(0,180,230,0.07)" : "none",
                  background: selected ? "rgba(0,180,230,0.07)" : "transparent",
                  color: selected ? "#0090c8" : "#334e5c",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  fontWeight: selected ? 700 : 400,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span>{f.label}</span>
                {selected && (
                  <span style={{ marginLeft: "auto" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#00b4e6" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Vitrina_casas() {
  const { casas, loading, error } = useCasasConImagen();
  const navigate = useNavigate();
  const [busqueda, setBusqueda] = useState("");
  const [filtroDisp, setFiltroDisp] = useState("todas");

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
        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
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

        /* En móvil: ocultar botones de filtro, mostrar dropdown */
        .filtros-desktop { display: flex; gap: 12px; flex-wrap: wrap; }
        .filtros-mobile  { display: none; }

        @media (max-width: 600px) {
          .filtros-desktop { display: none !important; }
          .filtros-mobile  { display: block !important; }
        }
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
            {/* Buscador — en móvil incluye el dropdown integrado a la derecha */}
            <div
              style={{ position: "relative", flex: "1 1 280px", maxWidth: 520, zIndex: 1000,}}
            >
              {/* Icono lupa */}
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
                  zIndex: 1,
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
                  // En móvil: padding derecho mayor para no solapar con el dropdown
                  padding: "11px 48px 11px 40px",
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

              {/* Dropdown de filtro DENTRO del buscador — solo visible en móvil */}
              <div
                className="filtros-mobile"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <FiltroDropdown
                  filtroDisp={filtroDisp}
                  setFiltroDisp={setFiltroDisp}
                />
              </div>
            </div>

            {/* Botones de filtro — solo en desktop */}
            <div className="filtros-desktop">
              {FILTROS.map((f) => (
                <button
                  key={f.key}
                  className="filtro-btn"
                  onClick={() => setFiltroDisp(f.key)}
                  style={{
                    padding: "9px 18px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    border: "1.5px solid",
                    fontFamily: "'DM Sans', sans-serif",
                    borderColor:
                      filtroDisp === f.key ? "#00b4e6" : "rgba(0,180,230,0.2)",
                    background:
                      filtroDisp === f.key
                        ? "linear-gradient(135deg, #00c6f0, #0090c8)"
                        : "#fff",
                    color: filtroDisp === f.key ? "#fff" : "#5aabb8",
                    boxShadow:
                      filtroDisp === f.key
                        ? "0 4px 14px rgba(0,180,230,0.3)"
                        : "none",
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
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