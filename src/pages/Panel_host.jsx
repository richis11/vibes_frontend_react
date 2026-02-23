import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import casasService from "../api/casas_service";
import { useAuth } from "../context/AuthContext";
import Modal_casa_host from "../components/Modal_casa_host";
import casaImagenesService from "../api/casa_imagenes_service";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80";

// ─── Badges ───────────────────────────────────────────────────────────────
const dispConfig = {
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
const estadoConfig = {
  activa: { label: "Activa", color: "#16a34a", bg: "rgba(22,163,74,0.1)" },
  inactiva: {
    label: "Inactiva",
    color: "#64748b",
    bg: "rgba(100,116,139,0.1)",
  },
  suspendida: {
    label: "Suspendida",
    color: "#d97706",
    bg: "rgba(217,119,6,0.1)",
  },
};

function Chip({ cfg }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "3px 10px",
        borderRadius: 99,
        color: cfg.color,
        background: cfg.bg,
        letterSpacing: "0.04em",
      }}
    >
      {cfg.label}
    </span>
  );
}

// ─── Tarjeta de casa ──────────────────────────────────────────────────────
function CasaHostCard({ casa, onEditar }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const disp = dispConfig[casa.disponibilidad] ?? {
    label: casa.disponibilidad,
    color: "#666",
    bg: "#eee",
  };
  const est = estadoConfig[casa.estado] ?? {
    label: casa.estado,
    color: "#666",
    bg: "#eee",
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 18,
        overflow: "hidden",
        border: `1.5px solid ${hovered ? "rgba(0,180,230,0.35)" : "rgba(0,180,230,0.12)"}`,
        boxShadow: hovered
          ? "0 16px 48px rgba(0,150,210,0.2)"
          : "0 4px 20px rgba(0,140,190,0.08)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        transition: "all 0.25s cubic-bezier(.22,1,.36,1)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Imagen */}
      <div
        style={{
          position: "relative",
          height: 185,
          overflow: "hidden",
          background: "#d0eefa",
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
            transition: "transform 0.35s ease",
          }}
        />
        {/* Precio */}
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            background: "rgba(0,20,40,0.72)",
            backdropFilter: "blur(6px)",
            borderRadius: 10,
            padding: "5px 12px",
            color: "#fff",
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 800 }}>
            ${parseFloat(casa.precio).toFixed(0)}
          </span>
          <span style={{ fontSize: 11, opacity: 0.75 }}>/noche</span>
        </div>
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
          }}
        >
          <Chip cfg={disp} />
          <Chip cfg={est} />
        </div>
      </div>

      {/* Contenido */}
      <div
        style={{
          padding: "16px 18px 18px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: 15,
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
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {casa.descripcion}
          </p>
        )}

        {/* Botones */}
        <div
          style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 4 }}
        >
          <button
            onClick={() => navigate(`/casas/${casa.id}`)}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 10,
              border: "1.5px solid rgba(0,180,230,0.3)",
              background: "#fff",
              color: "#0090c8",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.18s",
              fontFamily: "inherit",
            }}
          >
            Ver
          </button>
          <button
            onClick={() => onEditar(casa)}
            style={{
              flex: 2,
              padding: "9px 0",
              borderRadius: 10,
              border: "none",
              background: "linear-gradient(135deg, #00c6f0, #0090c8)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.18s",
              fontFamily: "inherit",
              boxShadow: "0 3px 12px rgba(0,180,230,0.3)",
            }}
          >
            ✏️ Editar
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
        borderRadius: 18,
        overflow: "hidden",
        border: "1.5px solid rgba(0,180,230,0.10)",
        background: "#fff",
      }}
    >
      <div className="sk" style={{ height: 185 }} />
      <div
        style={{
          padding: "16px 18px 18px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {[80, 60, 100, 40].map((w, i) => (
          <div
            key={i}
            className="sk"
            style={{
              height: i === 3 ? 34 : 13,
              width: `${w}%`,
              borderRadius: 8,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Stats card ───────────────────────────────────────────────────────────
function StatCard({ icon, label, value, color }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 14,
        padding: "16px 20px",
        border: "1.5px solid rgba(0,180,230,0.12)",
        boxShadow: "0 2px 12px rgba(0,140,190,0.07)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flex: "1 1 140px",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          fontSize: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: color ?? "rgba(0,180,230,0.1)",
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: "#002d44",
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 12, color: "#5aabb8", marginTop: 2 }}>
          {label}
        </div>
      </div>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Panel_host() {
  const { user } = useAuth();
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [casaEditando, setCasaEditando] = useState(null);
  const [filtro, setFiltro] = useState("todas");

  const fetchCasas = async () => {
    if (!user?.host_id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const data = await casasService.getCasasPorHost(user.host_id);
      const ordenadas = [...data].reverse();

      // Cargar imagen principal de cada casa en paralelo
      const casasConImagen = await Promise.all(
        ordenadas.map(async (casa) => {
          try {
            const imagenes = await casaImagenesService.getImagenesPorCasa(
              casa.id,
            );
            const principal =
              imagenes.find((img) => img.es_principal) ?? imagenes[0];
            return { ...casa, imagen_principal: principal?.url ?? null };
          } catch {
            return { ...casa, imagen_principal: null };
          }
        }),
      );

      setCasas(casasConImagen);
    } catch (err) {
      if (err.response?.status !== 404)
        toast.error("Error al cargar tus casas");
      setCasas([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasas();
  }, [user]);

  const handleEditar = (casa) => {
    setCasaEditando(casa);
    setShowModal(true);
  };

  const handleNueva = () => {
    setCasaEditando(null);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCasaEditando(null);
  };

  // Stats
  const total = casas.length;
  const activas = casas.filter((c) => c.estado === "activa").length;
  const disponibles = casas.filter(
    (c) => c.disponibilidad === "disponible" && c.estado === "activa",
  ).length;
  const ingresos = casas.reduce((acc, c) => acc + parseFloat(c.precio || 0), 0);

  // Filtro
  const FILTROS = [
    { key: "todas", label: "Todas" },
    { key: "disponible", label: "Disponibles" },
    { key: "ocupada", label: "Ocupadas" },
    { key: "inactiva", label: "Inactivas" },
  ];

  const casasFiltradas =
    filtro === "todas"
      ? casas
      : filtro === "inactiva"
        ? casas.filter((c) => c.estado === "inactiva")
        : casas.filter(
            (c) => c.disponibilidad === filtro && c.estado === "activa",
          );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk { background: linear-gradient(90deg,#e0f4ff 25%,#c8ecfa 50%,#e0f4ff 75%);
          background-size:200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
        .panel-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
          gap: 22px;
        }
        .card-wrapper { animation: fadeUp 0.4s ease both; }
        .card-wrapper:nth-child(1){animation-delay:0.05s}
        .card-wrapper:nth-child(2){animation-delay:0.1s}
        .card-wrapper:nth-child(3){animation-delay:0.15s}
        .card-wrapper:nth-child(4){animation-delay:0.2s}
        .nueva-btn { transition: all 0.2s; }
        .nueva-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,180,230,0.45) !important; }
        .filtro-tab { transition: all 0.18s; cursor: pointer; }
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
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "#00b4e6",
                  textTransform: "uppercase",
                }}
              >
                Mi panel
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
                Mis propiedades
              </h1>
              <p style={{ color: "#5aabb8", fontSize: 14, margin: 0 }}>
                {user?.nombres ? `Hola, ${user.nombres} 🏡` : ""}
              </p>
            </div>

            {/* Botón nueva casa */}
            <button
              className="nueva-btn"
              onClick={handleNueva}
              style={{
                padding: "12px 24px",
                border: "none",
                borderRadius: 12,
                background: "linear-gradient(135deg, #00c6f0, #0090c8)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 18px rgba(0,180,230,0.38)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span>
              Nueva propiedad
            </button>
          </div>

          {/* Stats */}
          {!loading && casas.length > 0 && (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                marginBottom: 28,
              }}
            >
              <StatCard
                icon="🏠"
                label="Total propiedades"
                value={total}
                color="rgba(0,180,230,0.12)"
              />
              <StatCard
                icon="✅"
                label="Activas"
                value={activas}
                color="rgba(22,163,74,0.1)"
              />
              <StatCard
                icon="📅"
                label="Disponibles"
                value={disponibles}
                color="rgba(0,180,230,0.1)"
              />
              <StatCard
                icon="💰"
                label="Precio promedio"
                value={`$${total > 0 ? (ingresos / total).toFixed(0) : 0}`}
                color="rgba(124,58,237,0.1)"
              />
            </div>
          )}

          {/* Sin host_id */}
          {!user?.host_id && !loading && (
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
                🏡
              </span>
              <h3
                style={{
                  fontFamily: "'Syne',sans-serif",
                  color: "#002d44",
                  marginBottom: 8,
                }}
              >
                No tienes perfil de host
              </h3>
              <p style={{ color: "#5aabb8", fontSize: 14 }}>
                Contacta al administrador para activar tu cuenta como host.
              </p>
            </div>
          )}

          {/* Filtros */}
          {user?.host_id && (
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
                    }}
                  >
                    {f.label}
                    {f.key !== "todas" && !loading && (
                      <span
                        style={{ marginLeft: 5, fontSize: 11, opacity: 0.6 }}
                      >
                        (
                        {f.key === "inactiva"
                          ? casas.filter((c) => c.estado === "inactiva").length
                          : casas.filter(
                              (c) =>
                                c.disponibilidad === f.key &&
                                c.estado === "activa",
                            ).length}
                        )
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Grid */}
              <div className="panel-grid">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                ) : casasFiltradas.length > 0 ? (
                  casasFiltradas.map((casa, i) => (
                    <div
                      key={casa.id}
                      className="card-wrapper"
                      style={{ animationDelay: `${i * 0.07}s` }}
                    >
                      <CasaHostCard casa={casa} onEditar={handleEditar} />
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      gridColumn: "1 / -1",
                      textAlign: "center",
                      padding: "50px 20px",
                      background: "#fff",
                      borderRadius: 16,
                      border: "1.5px dashed rgba(0,180,230,0.2)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 38,
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
                        ? "Aún no tienes propiedades"
                        : "Sin propiedades en este filtro"}
                    </h3>
                    <p
                      style={{
                        color: "#5aabb8",
                        fontSize: 14,
                        marginBottom: 18,
                      }}
                    >
                      {filtro === "todas"
                        ? "Agrega tu primera propiedad para comenzar"
                        : "Prueba con otro filtro"}
                    </p>
                    {filtro === "todas" ? (
                      <button
                        onClick={handleNueva}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 10,
                          border: "none",
                          background:
                            "linear-gradient(135deg, #00c6f0, #0090c8)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        + Agregar propiedad
                      </button>
                    ) : (
                      <button
                        onClick={() => setFiltro("todas")}
                        style={{
                          padding: "10px 24px",
                          borderRadius: 10,
                          border: "1.5px solid rgba(0,180,230,0.3)",
                          background: "#fff",
                          color: "#0090c8",
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        Ver todas
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      <Modal_casa_host
        show={showModal}
        onClose={handleClose}
        casa={casaEditando}
        hostId={user?.host_id}
        onSuccess={fetchCasas}
      />
    </>
  );
}
