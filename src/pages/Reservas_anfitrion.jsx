import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import reservasService from "../api/reservas_service";
import casaImagenesService from "../api/casa_imagenes_service";
import { mensajeError } from "../utils/mensajeError";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80";

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

const ESTADOS_OPCIONES = [
  { value: "pendiente_pago", label: "⏳ Pendiente de pago" },
  { value: "pagada", label: "💳 Pagada" },
  { value: "confirmada", label: "✅ Confirmada" },
  { value: "completada", label: "🏁 Completada" },
  { value: "cancelada", label: "❌ Cancelada" },
  { value: "reembolsada", label: "↩️ Reembolsada" },
];

// Estados a los que el anfitrión puede mover una reserva (los pagos los marca la plataforma)
const ESTADOS_EDITABLES_HOST = ["confirmada", "completada", "cancelada"];

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

// ─── BotonesZona — componente INDEPENDIENTE (evita re-creación en cada render de la card) ──
function BotonesZona({ reserva, isMobile, onEstadoChanged }) {
  const navigate = useNavigate();
  const [editandoEstado, setEditandoEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState(reserva.estado);
  const [guardando, setGuardando] = useState(false);

  // Sincronizar si el estado cambia desde afuera
  useEffect(() => {
    setNuevoEstado(reserva.estado);
  }, [reserva.estado]);

  const handleConfirmarEstado = async () => {
    if (nuevoEstado === reserva.estado) {
      setEditandoEstado(false);
      return;
    }
    setGuardando(true);
    try {
      await reservasService.editarReserva(reserva.id, { estado: nuevoEstado });
      toast.success("Estado actualizado");
      onEstadoChanged(reserva.id, nuevoEstado);
      setEditandoEstado(false);
    } catch (err) {
      toast.error(mensajeError(err, "Error al actualizar el estado"));
    } finally {
      setGuardando(false);
    }
  };

  const btnBase = {
    padding: "8px 14px",
    border: "1.5px solid rgba(0,180,230,0.35)",
    borderRadius: 10,
    background: "#fff",
    color: "#0090c8",
    fontSize: 13,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.18s",
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: "nowrap",
    ...(isMobile && { flex: 1 }),
  };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        gap: 8,
        alignItems: "center",
        ...(isMobile && { width: "100%" }),
      }}
    >
      {/* Dropdown flotando ARRIBA */}
      {editandoEstado && (
        <select
          value={nuevoEstado}
          onChange={(e) => setNuevoEstado(e.target.value)}
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: 0,
            right: 0,
            width: "100%",
            padding: "8px 12px",
            border: "1.5px solid rgba(0,180,230,0.4)",
            borderRadius: 10,
            fontSize: 13,
            fontFamily: "'DM Sans', sans-serif",
            color: "#002d44",
            background: "#f0faff",
            boxShadow: "0 -4px 20px rgba(0,140,200,0.15)",
            cursor: "pointer",
            outline: "none",
            animation: "fadeUp 0.15s ease both",
            zIndex: 10,
          }}
        >
          {ESTADOS_OPCIONES.filter(
            (op) =>
              ESTADOS_EDITABLES_HOST.includes(op.value) ||
              op.value === reserva.estado,
          ).map((op) => (
            <option
              key={op.value}
              value={op.value}
              disabled={!ESTADOS_EDITABLES_HOST.includes(op.value)}
            >
              {op.label}
            </option>
          ))}
        </select>
      )}

      {!editandoEstado ? (
        <button onClick={() => setEditandoEstado(true)} style={btnBase}>
          Cambiar estado
        </button>
      ) : (
        <>
          <button
            onClick={handleConfirmarEstado}
            disabled={guardando}
            style={{
              padding: "8px 14px",
              border: "none",
              borderRadius: 10,
              background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: guardando ? "not-allowed" : "pointer",
              fontFamily: "'DM Sans', sans-serif",
              opacity: guardando ? 0.7 : 1,
              whiteSpace: "nowrap",
              ...(isMobile && { flex: 1 }),
            }}
          >
            {guardando ? "..." : "✔"}
          </button>
          <button
            onClick={() => {
              setEditandoEstado(false);
              setNuevoEstado(reserva.estado);
            }}
            style={{
              padding: "8px 10px",
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: 10,
              background: "#fff",
              color: "#888",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ✕
          </button>
        </>
      )}

      <button
        onClick={() => navigate(`/casas/${reserva.casa_id}`)}
        style={btnBase}
      >
        Ver casa
      </button>
    </div>
  );
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

// ─── Tarjeta de Reserva ───────────────────────────────────────────────────
function ReservaCard({ reserva, onEstadoChanged }) {
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
  const guestNombre =
    `${reserva.guest_nombres || ""} ${reserva.guest_apellidos || ""}`.trim() ||
    "Cliente";

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
        overflow: "visible",
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
          alt="Casa"
          onError={() => setImgError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
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
          padding: isMobile ? "14px 14px" : "18px 20px",
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
            gap: 8,
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
                marginBottom: 2,
              }}
            >
              {reserva.casa_nombre ?? "Casa"}
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
              {guestNombre}
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

        {/* Fechas */}
        <div style={{ display: "flex", gap: isMobile ? 10 : 20 }}>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "#b0d4e0",
              fontSize: 16,
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

        {/* DESKTOP: precio + botones en la misma fila */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
            <BotonesZona
              reserva={reserva}
              isMobile={false}
              onEstadoChanged={onEstadoChanged}
            />
          </div>
        )}

        {/* MOBILE: precio arriba, botones abajo ocupando todo el ancho */}
        {isMobile && (
          <>
            <div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#002d44" }}>
                ${total}
              </span>
              <span style={{ fontSize: 11, color: "#8bb8c8", marginLeft: 4 }}>
                {reserva.moneda} · ${precioPorNoche}/n
              </span>
            </div>
            <BotonesZona
              reserva={reserva}
              isMobile={true}
              onEstadoChanged={onEstadoChanged}
            />
          </>
        )}
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

// ─── Filtros ──────────────────────────────────────────────────────────────
const FILTROS = [
  { key: "todas", label: "Todas" },
  { key: "pendiente_pago", label: "Pendientes" },
  { key: "confirmada", label: "Confirmadas" },
  { key: "completada", label: "Completadas" },
  { key: "cancelada", label: "Canceladas" },
];

// ─── Main ─────────────────────────────────────────────────────────────────
export default function Reservas_anfitrion() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todas");
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const fetchReservas = async () => {
      if (!user?.host_id) {
        setLoading(false);
        return;
      }

      try {
        const todasReservas = await reservasService.getReservasPorHost(
          user.host_id,
        );

        console.log("DATOS RECIBIDOS PARA RESERVAS HOST");
        console.log(todasReservas);

        const ordenadas = [...todasReservas].reverse();

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
          toast.error("Error al cargar las reservas");
        }
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, [user]);

  const handleEstadoChanged = (id, nuevoEstado) => {
    setReservas((prev) =>
      prev.map((r) => (r.id === id ? { ...r, estado: nuevoEstado } : r)),
    );
  };

  const reservasFiltradas = reservas
    .filter((r) => filtro === "todas" || r.estado === filtro)
    .filter(
      (r) =>
        busqueda.trim() === "" ||
        r.casa_nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        `${r.guest_nombres ?? ""} ${r.guest_apellidos ?? ""}`
          .toLowerCase()
          .includes(busqueda.toLowerCase()),
    );
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .sk {
          background: linear-gradient(90deg, #e8f4fa 25%, #d0eaf5 50%, #e8f4fa 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
          @keyframes dropIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
.host-filtros-desktop { display: flex; gap: 8px; flex-wrap: wrap; }
.host-filtros-mobile  { display: none; }
@media (max-width: 600px) {
  .host-filtros-desktop { display: none !important; }
  .host-filtros-mobile  { display: block !important; }
}
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #f0faff 0%, #e8f6ff 100%)",
          paddingTop: 80,
          paddingBottom: 60,
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 780, margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 28,
                fontWeight: 800,
                color: "#002d44",
                margin: 0,
                marginBottom: 6,
              }}
            >
              Reservas Recibidas
            </h1>
            <p style={{ color: "#6aabb8", fontSize: 14, margin: 0 }}>
              Gestiona las reservas de tus propiedades
            </p>
          </div>

          {/* Buscador + Filtros */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            {/* Botones — solo en desktop */}
            <div className="host-filtros-desktop">
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
                placeholder="Buscar por casa o huésped..."
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
                className="host-filtros-mobile"
                style={{
                  position: "absolute",
                  right: 8,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <FiltroDropdown filtroDisp={filtro} setFiltroDisp={setFiltro} />
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
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
            ) : reservasFiltradas.length > 0 ? (
              reservasFiltradas.map((r, i) => (
                <div key={r.id} style={{ animationDelay: `${i * 0.07}s` }}>
                  <ReservaCard
                    reserva={r}
                    onEstadoChanged={handleEstadoChanged}
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
                  style={{ fontSize: 40, display: "block", marginBottom: 12 }}
                >
                  📋
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
                    ? "No tienes reservas aún"
                    : `No hay reservas ${FILTROS.find((f) => f.key === filtro)?.label.toLowerCase()}`}
                </h3>
                <p style={{ color: "#8bb8c8", fontSize: 14 }}>
                  {filtro === "todas"
                    ? "Cuando alguien reserve una de tus propiedades, aparecerá aquí."
                    : "Prueba con otro filtro."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
