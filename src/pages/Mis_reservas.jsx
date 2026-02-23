import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import reservasService from "../api/reservas_service";
import { useAuth } from "../context/AuthContext";
import casaImagenesService from "../api/casa_imagenes_service";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80";

// ─── Config de estados ────────────────────────────────────────────────────
const estadoConfig = {
  pendiente_pago: {
    label: "Pendiente de pago",
    color: "#d97706",
    bg: "rgba(217,119,6,0.1)",
    icon: "⏳",
  },
  pagada: {
    label: "Pagada",
    color: "#0090c8",
    bg: "rgba(0,144,200,0.1)",
    icon: "💳",
  },
  confirmada: {
    label: "Confirmada",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.1)",
    icon: "✅",
  },
  cancelada: {
    label: "Cancelada",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: "❌",
  },
  completada: {
    label: "Completada",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
    icon: "🏁",
  },
  reembolsada: {
    label: "Reembolsada",
    color: "#64748b",
    bg: "rgba(100,116,139,0.1)",
    icon: "↩️",
  },
};

function BadgeEstado({ estado }) {
  const cfg = estadoConfig[estado] ?? {
    label: estado,
    color: "#666",
    bg: "#eee",
    icon: "•",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 99,
        color: cfg.color,
        background: cfg.bg,
        letterSpacing: "0.03em",
      }}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

function formatFecha(fechaStr) {
  if (!fechaStr) return "-";
  return new Date(fechaStr).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Tarjeta de reserva ───────────────────────────────────────────────────
function ReservaCard({ reserva }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const noches = reserva.noches ?? 0;
  const total = parseFloat(reserva.total ?? 0).toFixed(2);
  const precioPorNoche = parseFloat(reserva.precio_por_noche ?? 0).toFixed(2);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "stretch",
        background: "#fff",
        borderRadius: 16,
        border: `1.5px solid ${hovered ? "rgba(0,180,230,0.35)" : "rgba(0,180,230,0.12)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(0,150,210,0.18)"
          : "0 2px 16px rgba(0,140,190,0.08)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        transition: "all 0.22s cubic-bezier(.22,1,.36,1)",
        overflow: "hidden",
        animation: "fadeUp 0.4s ease both",
      }}
    >
      {/* Imagen lateral */}
      <div
        style={{
          width: 140,
          minWidth: 140,
          position: "relative",
          background: "#d0eefa",
          flexShrink: 0,
        }}
      >
        <img
          src={imgError ? IMAGEN_GENERICA : reserva.imagen_principal || IMAGEN_GENERICA}
          alt="Casa"
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Número de reserva sobre imagen */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 8,
            background: "rgba(0,20,40,0.65)",
            backdropFilter: "blur(4px)",
            borderRadius: 6,
            padding: "2px 8px",
            color: "#fff",
            fontSize: 11,
            fontWeight: 700,
          }}
        >
          #{reserva.id}
        </div>
      </div>

      {/* Contenido */}
      <div
        style={{
          flex: 1,
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 10,
          minWidth: 0,
        }}
      >
        {/* Fila superior: nombre casa + badge estado */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#007aaa",
                marginBottom: 4,
              }}
            >
              {reserva.casa_nombre ?? `Casa #${reserva.casa_id}`}
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                color: "#5aabb8",
                fontSize: 13,
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>
                Reserva {noches} noche{noches !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <BadgeEstado estado={reserva.estado} />
        </div>

        {/* Fechas */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#007aaa",
                marginBottom: 2,
              }}
            >
              Llegada
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#002d44" }}>
              {formatFecha(reserva.fecha_inicio)}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#b0d4e0",
              fontSize: 18,
            }}
          >
            →
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#007aaa",
                marginBottom: 2,
              }}
            >
              Salida
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#002d44" }}>
              {formatFecha(reserva.fecha_fin)}
            </div>
          </div>
        </div>

        {/* Fila inferior: precio + botón */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <div>
            <span style={{ fontSize: 20, fontWeight: 800, color: "#002d44" }}>
              ${total}
            </span>
            <span style={{ fontSize: 12, color: "#8bb8c8", marginLeft: 4 }}>
              {reserva.moneda} · ${precioPorNoche}/noche
            </span>
          </div>
          <button
            onClick={() => navigate(`/casas/${reserva.casa_id}`)}
            style={{
              padding: "8px 18px",
              border: "1.5px solid rgba(0,180,230,0.35)",
              borderRadius: 10,
              background: hovered ? "rgba(0,180,230,0.07)" : "#fff",
              color: "#0090c8",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.18s",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Ver casa
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div
      style={{
        display: "flex",
        height: 130,
        borderRadius: 16,
        overflow: "hidden",
        border: "1.5px solid rgba(0,180,230,0.10)",
      }}
    >
      <div className="sk" style={{ width: 140, minWidth: 140 }} />
      <div
        style={{
          flex: 1,
          padding: "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {[160, 120, 200].map((w, i) => (
          <div
            key={i}
            className="sk"
            style={{ height: 14, width: w, borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Filtro tab ───────────────────────────────────────────────────────────
const FILTROS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente_pago", label: "Pendientes" },
  { key: "confirmada", label: "Confirmadas" },
  { key: "completada", label: "Completadas" },
  { key: "cancelada", label: "Canceladas" },
];

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Mis_reservas() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");

  useEffect(() => {
    const fetchReservas = async () => {
  if (!user?.persona_id) {
    setLoading(false);
    return;
  }
  try {
    const data = await reservasService.getReservasPorGuest(user.persona_id);
    const ordenadas = [...data].reverse();

    // Enriquecer cada reserva con la imagen principal de su casa
    const reservasConImagen = await Promise.all(
      ordenadas.map(async (reserva) => {
        try {
          const imagenes = await casaImagenesService.getImagenesPorCasa(reserva.casa_id);
          const principal = imagenes.find((img) => img.es_principal) ?? imagenes[0];
          return { ...reserva, imagen_principal: principal?.url ?? null };
        } catch {
          return { ...reserva, imagen_principal: null };
        }
      })
    );

    setReservas(reservasConImagen);
  } catch (err) {
    if (err.response?.status !== 404) {
      toast.error("Error al cargar tus reservas");
    }
    setReservas([]);
  } finally {
    setLoading(false);
  }
};
    fetchReservas();
  }, [user]);

  const reservasFiltradas =
    filtro === "todas" ? reservas : reservas.filter((r) => r.estado === filtro);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk { background: linear-gradient(90deg,#e0f4ff 25%,#c8ecfa 50%,#e0f4ff 75%);
          background-size:200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        .filtro-tab { transition: all 0.18s; cursor: pointer; }
        .filtro-tab:hover { color: #0090c8 !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          paddingTop: 80,
          paddingBottom: 60,
          background: "linear-gradient(180deg, #edfaff 0%, #f5feff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
                color: "#00b4e6",
                textTransform: "uppercase",
              }}
            >
              Mi cuenta
            </span>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(22px, 3.5vw, 32px)",
                fontWeight: 800,
                color: "#002d44",
                letterSpacing: "-0.02em",
                margin: "6px 0 4px",
              }}
            >
              Mis reservas
            </h1>
            <p style={{ color: "#5aabb8", fontSize: 14, margin: 0 }}>
              {user?.nombres ? `Hola, ${user.nombres} 👋` : ""}
              {reservas.length > 0 && !loading
                ? ` · ${reservas.length} reserva${reservas.length !== 1 ? "s" : ""} en total`
                : ""}
            </p>
          </div>

          {/* Sin persona_id */}
          {!user?.persona_id && !loading && (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                background: "#fff",
                borderRadius: 16,
                border: "1.5px dashed rgba(0,180,230,0.25)",
              }}
            >
              <span
                style={{ fontSize: 40, display: "block", marginBottom: 14 }}
              >
                👤
              </span>
              <h3
                style={{
                  fontFamily: "'Syne',sans-serif",
                  color: "#002d44",
                  marginBottom: 8,
                }}
              >
                Perfil incompleto
              </h3>
              <p style={{ color: "#5aabb8", fontSize: 14 }}>
                Tu cuenta no tiene un perfil de persona asociado. Contacta al
                soporte.
              </p>
            </div>
          )}

          {/* Tabs de filtro */}
          {user?.persona_id && (
            <>
              <div
                style={{
                  display: "flex",
                  gap: 4,
                  flexWrap: "wrap",
                  background: "rgba(0,160,210,0.07)",
                  borderRadius: 12,
                  padding: 5,
                  marginBottom: 24,
                }}
              >
                {FILTROS.map((f) => (
                  <button
                    key={f.key}
                    className="filtro-tab"
                    onClick={() => setFiltro(f.key)}
                    style={{
                      flex: 1,
                      minWidth: 80,
                      padding: "8px 12px",
                      border: "none",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      background: filtro === f.key ? "#fff" : "transparent",
                      color:
                        filtro === f.key ? "#0090c8" : "rgba(0,100,148,0.45)",
                      boxShadow:
                        filtro === f.key
                          ? "0 2px 10px rgba(0,150,200,0.15)"
                          : "none",
                      transition: "all 0.18s",
                    }}
                  >
                    {f.label}
                    {f.key !== "todas" && !loading && (
                      <span
                        style={{
                          marginLeft: 5,
                          fontSize: 11,
                          opacity:
                            reservas.filter((r) => r.estado === f.key).length >
                            0
                              ? 1
                              : 0.4,
                        }}
                      >
                        ({reservas.filter((r) => r.estado === f.key).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Lista */}
              <div
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : reservasFiltradas.length > 0 ? (
                  reservasFiltradas.map((r, i) => (
                    <div key={r.id} style={{ animationDelay: `${i * 0.07}s` }}>
                      <ReservaCard reserva={r} />
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "50px 20px",
                      background: "#fff",
                      borderRadius: 16,
                      border: "1.5px dashed rgba(0,180,230,0.2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 40,
                        display: "block",
                        marginBottom: 12,
                      }}
                    >
                      🏠
                    </span>
                    <h3
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        color: "#002d44",
                        fontSize: 18,
                        marginBottom: 8,
                      }}
                    >
                      {filtro === "todas"
                        ? "Aún no tienes reservas"
                        : `No hay reservas ${FILTROS.find((f) => f.key === filtro)?.label.toLowerCase()}`}
                    </h3>
                    <p
                      style={{
                        color: "#5aabb8",
                        fontSize: 14,
                        marginBottom: 20,
                      }}
                    >
                      {filtro === "todas"
                        ? "Explora nuestras casas y haz tu primera reserva"
                        : "Prueba con otro filtro"}
                    </p>
                    <button
                      onClick={() =>
                        filtro === "todas"
                          ? navigate("/casas")
                          : setFiltro("todas")
                      }
                      style={{
                        padding: "10px 24px",
                        borderRadius: 10,
                        border: "none",
                        background: "linear-gradient(135deg, #00c6f0, #0090c8)",
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {filtro === "todas" ? "Explorar casas" : "Ver todas"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
