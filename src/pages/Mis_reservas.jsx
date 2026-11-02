import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import reservasService from "../api/reservas_service";
import { useAuth } from "../context/AuthContext";
import casaImagenesService from "../api/casa_imagenes_service";
import pagosService from "../api/pagos_service";
import Modal_pago from "../components/Modal_pago";

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

// ─── Filtros a nivel de módulo (accesible por FiltroDropdown) ─────────────
const FILTROS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente_pago", label: "Pendientes" },
  { key: "pagada", label: "Pagadas" },
  { key: "confirmada", label: "Confirmadas" },
  { key: "completada", label: "Completadas" },
  { key: "cancelada", label: "Canceladas" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────
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

// ─── Dropdown filtro móvil ────────────────────────────────────────────────
function FiltroDropdown({ filtroDisp, setFiltroDisp }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isFiltered = filtroDisp !== "todas";

  return (
    <div ref={ref} style={{ position: "relative", zIndex: 1000 }}>
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
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="8" y1="12" x2="16" y2="12" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
        {isFiltered && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#f97316",
              border: "1.5px solid #fff",
            }}
          />
        )}
      </button>

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
            minWidth: 180,
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
                  borderBottom:
                    i < FILTROS.length - 1
                      ? "1px solid rgba(0,180,230,0.07)"
                      : "none",
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
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#00b4e6"
                      strokeWidth="2.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
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

// ─── Tarjeta de reserva (estilo Reservas_anfitrion) ───────────────────────
// Botón de pago según el último comprobante enviado
const botonPago = {
  en_revision: { label: "⏳ Pago en revisión", color: "#d97706", borde: "rgba(217,119,6,0.35)" },
  rechazado: { label: "⚠️ Reenviar comprobante", color: "#ef4444", borde: "rgba(239,68,68,0.35)" },
  ninguno: { label: "💳 Pagar", color: "#fff", borde: "transparent" },
};

function ReservaCard({ reserva, pago, onPagar }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 540);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 540);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const noches = reserva.noches ?? 0;
  const total = parseFloat(reserva.total ?? 0).toFixed(2);
  const precioPorNoche = parseFloat(reserva.precio_por_noche ?? 0).toFixed(2);
  const pendiente = reserva.estado === "pendiente_pago";
  const cfgPago = botonPago[pago?.estado] ?? botonPago.ninguno;

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
          width: isMobile ? 80 : 140,
          minWidth: isMobile ? 80 : 140,
          position: "relative",
          background: "#d0eefa",
          flexShrink: 0,
          borderRadius: "14px 0 0 14px",
          overflow: "hidden",
        }}
      >
        <img
          src={
            imgError
              ? IMAGEN_GENERICA
              : reserva.imagen_principal || IMAGEN_GENERICA
          }
          alt={reserva.casa_nombre}
          onError={() => setImgError(true)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.35s ease",
          }}
        />
        {/* Overlay degradado */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to right, rgba(0,20,40,0.18) 0%, transparent 100%)",
          }}
        />
      </div>

      {/* Contenido */}
      <div
        style={{
          flex: 1,
          padding: isMobile ? "14px 14px 14px 14px" : "18px 20px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 8 : 10,
          minWidth: 0,
        }}
      >
        {/* Fila 1: nombre + badge */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 8,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#00b4e6",
                marginBottom: 2,
              }}
            >
              Casa
            </p>
            <p
              style={{
                margin: 0,
                fontSize: isMobile ? 13 : 15,
                fontWeight: 700,
                color: "#002d44",
                fontFamily: "'Syne', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {reserva.casa_nombre || "Propiedad"}
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#8bb8c8",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                · {noches}n
              </span>
            </p>
          </div>
          <BadgeEstado estado={reserva.estado} />
        </div>

        {/* Fila 2: fechas */}
        <div
          style={{
            display: "flex",
            gap: isMobile ? 10 : 20,
            alignItems: "center",
          }}
        >
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
            <div
              style={{
                fontSize: isMobile ? 12 : 14,
                fontWeight: 600,
                color: "#002d44",
              }}
            >
              {formatFecha(reserva.fecha_inicio)}
            </div>
          </div>
          <div style={{ color: "#b0d4e0", fontSize: 16 }}>→</div>
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
            <div
              style={{
                fontSize: isMobile ? 12 : 14,
                fontWeight: 600,
                color: "#002d44",
              }}
            >
              {formatFecha(reserva.fecha_fin)}
            </div>
          </div>
        </div>

        {/* Fila 3: precio + botón */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            marginTop: "auto",
          }}
        >
          <div>
            <span
              style={{
                fontSize: isMobile ? 16 : 20,
                fontWeight: 800,
                color: "#002d44",
              }}
            >
              ${total}
            </span>
            <span style={{ fontSize: 11, color: "#8bb8c8", marginLeft: 4 }}>
              {reserva.moneda} · ${precioPorNoche}/noche
            </span>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {pendiente && (
            <button
              onClick={() => onPagar(reserva)}
              style={{
                padding: isMobile ? "7px 12px" : "8px 16px",
                borderRadius: 10,
                border: `1.5px solid ${cfgPago.borde}`,
                background:
                  cfgPago === botonPago.ninguno
                    ? "linear-gradient(135deg, #00c6f0, #0090c8)"
                    : "#fff",
                color: cfgPago.color,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              {cfgPago.label}
            </button>
          )}
          <button
            onClick={() => navigate(`/casas/${reserva.casa_id}`)}
            style={{
              padding: isMobile ? "7px 12px" : "8px 16px",
              borderRadius: 10,
              border: "1.5px solid rgba(0,180,230,0.3)",
              background: hovered ? "rgba(0,180,230,0.07)" : "#fff",
              color: "#0090c8",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.18s",
              fontFamily: "'DM Sans', sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Ver casa
          </button>
          </div>
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

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Mis_reservas() {
  const { user } = useAuth();

  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");
  const [ultimoPago, setUltimoPago] = useState({}); // reserva_id -> último pago
  const [reservaAPagar, setReservaAPagar] = useState(null);

  const cargarPagos = () => {
    pagosService
      .getMisPagos()
      .then((pagos) => {
        // Vienen del más nuevo al más viejo: el primero de cada reserva es el último
        const porReserva = {};
        for (const p of pagos) porReserva[p.reserva_id] ??= p;
        setUltimoPago(porReserva);
      })
      .catch(() => setUltimoPago({}));
  };

  useEffect(() => {
    if (user?.persona_id) cargarPagos();
  }, [user]);

  useEffect(() => {
    const fetchReservas = async () => {
      if (!user?.persona_id) {
        setLoading(false);
        return;
      }
      try {
        const data = await reservasService.getReservasPorGuest(user.persona_id);
        const ordenadas = [...data].reverse();

        const reservasConImagen = await Promise.all(
          ordenadas.map(async (reserva) => {
            try {
              const imagenes = await casaImagenesService.getImagenesPorCasa(
                reserva.casa_id,
              );
              const principal =
                imagenes.find((img) => img.es_principal) ?? imagenes[0];
              return { ...reserva, imagen_principal: principal?.url ?? null };
            } catch {
              return { ...reserva, imagen_principal: null };
            }
          }),
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

  // Filtrado: por estado + búsqueda por nombre de casa
  const reservasFiltradas = reservas
    .filter((r) => filtro === "todas" || r.estado === filtro)
    .filter(
      (r) =>
        busqueda.trim() === "" ||
        r.casa_nombre?.toLowerCase().includes(busqueda.toLowerCase()),
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes dropIn  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .sk {
          background: linear-gradient(90deg,#e0f4ff 25%,#c8ecfa 50%,#e0f4ff 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        .reservas-filtros-desktop { display: flex; gap: 8px; flex-wrap: wrap; }
        .reservas-filtros-mobile  { display: none; }
        @media (max-width: 600px) {
          .reservas-filtros-desktop { display: none !important; }
          .reservas-filtros-mobile  { display: block !important; }
        }
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
              {user?.nombres ? `Hola, ${user.nombres}` : ""}
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

          {/* Buscador + Filtros */}
          {user?.persona_id && (
            <>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  alignItems: "center",
                  marginBottom: 16,
                }}
              >
                {/* Botones filtro — solo en desktop */}
                <div className="reservas-filtros-desktop">
                  {FILTROS.map((f) => (
                    <button
                      key={f.key}
                      onClick={() => setFiltro(f.key)}
                      style={{
                        padding: "9px 18px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        border: "1.5px solid",
                        fontFamily: "'DM Sans', sans-serif",
                        borderColor:
                          filtro === f.key ? "#00b4e6" : "rgba(0,180,230,0.2)",
                        background:
                          filtro === f.key
                            ? "linear-gradient(135deg, #00c6f0, #0090c8)"
                            : "#fff",
                        color: filtro === f.key ? "#fff" : "#5aabb8",
                        boxShadow:
                          filtro === f.key
                            ? "0 4px 14px rgba(0,180,230,0.3)"
                            : "none",
                        transition: "all 0.18s",
                      }}
                    >
                      {f.label}
                      {f.key !== "todas" && !loading && (
                        <span
                          style={{ marginLeft: 5, fontSize: 11, opacity: 0.75 }}
                        >
                          ({reservas.filter((r) => r.estado === f.key).length})
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Buscador */}
                <div
                  style={{
                    position: "relative",
                    flex: "1 1 240px",
                    maxWidth: 480,
                    zIndex: 1000,
                  }}
                >
                  {/* Lupa */}
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
                    type="text"
                    placeholder="Buscar por nombre de casa..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "11px 48px 11px 40px",
                      fontSize: 14,
                      borderRadius: 12,
                      border: "1.5px solid rgba(0,180,230,0.25)",
                      background: "#fff",
                      color: "#003a56",
                      fontFamily: "inherit",
                      boxSizing: "border-box",
                      outline: "none",
                      transition: "all 0.2s",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#00b4e6")}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(0,180,230,0.25)")
                    }
                  />

                  {/* Dropdown — solo en móvil */}
                  <div
                    className="reservas-filtros-mobile"
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <FiltroDropdown
                      filtroDisp={filtro}
                      setFiltroDisp={setFiltro}
                    />
                  </div>
                </div>
              </div>

              {/* Contador */}
              {!loading && (
                <p style={{ color: "#8bb8c8", fontSize: 13, marginBottom: 20 }}>
                  {reservasFiltradas.length === 0
                    ? "No se encontraron reservas"
                    : `${reservasFiltradas.length} ${reservasFiltradas.length === 1 ? "reserva encontrada" : "reservas encontradas"}`}
                </p>
              )}

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
                      <ReservaCard
                        reserva={r}
                        pago={ultimoPago[r.id]}
                        onPagar={setReservaAPagar}
                      />
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
                      {filtro === "todas" && busqueda.trim() === ""
                        ? "No tienes reservas aún"
                        : busqueda.trim() !== ""
                          ? "No hay resultados para tu búsqueda"
                          : `No hay reservas ${FILTROS.find((f) => f.key === filtro)?.label.toLowerCase()}`}
                    </h3>
                    <p
                      style={{
                        color: "#8bb8c8",
                        fontSize: 14,
                        marginBottom: 18,
                      }}
                    >
                      {filtro === "todas" && busqueda.trim() === ""
                        ? "Cuando hagas una reserva, aparecerá aquí."
                        : "Prueba con otro filtro o limpia la búsqueda."}
                    </p>
                    {(filtro !== "todas" || busqueda.trim() !== "") && (
                      <button
                        onClick={() => {
                          setFiltro("todas");
                          setBusqueda("");
                        }}
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

      <Modal_pago
        show={!!reservaAPagar}
        reserva={reservaAPagar}
        onClose={() => setReservaAPagar(null)}
        onEnviado={cargarPagos}
      />
    </>
  );
}
