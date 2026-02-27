import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import reservasService from "../api/reservas_service";
import casaImagenesService from "../api/casa_imagenes_service";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80";

// ─── Badge de Estado ──────────────────────────────────────────────────────
const estadoConfig = {
  pendiente_pago: {
    label: "Pendiente",
    color: "#f97316",
    bg: "rgba(249,115,22,0.12)",
  },
  confirmada: {
    label: "Confirmada",
    color: "#00b4e6",
    bg: "rgba(0,180,230,0.12)",
  },
  completada: {
    label: "Completada",
    color: "#16a34a",
    bg: "rgba(22,163,74,0.12)",
  },
  cancelada: {
    label: "Cancelada",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
};

function BadgeEstado({ estado }) {
  const cfg = estadoConfig[estado] ?? {
    label: estado,
    color: "#666",
    bg: "#eee",
  };
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 12px",
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

// ─── Formatear Fecha ──────────────────────────────────────────────────────
function formatFecha(isoString) {
  const fecha = new Date(isoString);
  return fecha.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// ─── Tarjeta de Reserva ───────────────────────────────────────────────────
function ReservaCard({ reserva }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const total = parseFloat(reserva.total || 0).toFixed(2);
  const precioPorNoche = parseFloat(reserva.precio_por_noche || 0).toFixed(2);
  const guestNombre = `${reserva.guest_nombres || ""} ${reserva.guest_apellidos || ""}`.trim() || "Cliente";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        sm: "row",
        background: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        border: `1.5px solid ${hovered ? "rgba(0,180,230,0.35)" : "rgba(0,180,230,0.12)"}`,
        boxShadow: hovered
          ? "0 12px 40px rgba(0,150,210,0.18)"
          : "0 4px 20px rgba(0,140,190,0.08)",
        transition: "all 0.25s cubic-bezier(.22,1,.36,1)",
      }}
    >
      <div style={{ display: "flex", height: 130 }}>
        {/* Imagen */}
        <div
          style={{
            width: 140,
            minWidth: 140,
            background: "#d0eefa",
            position: "relative",
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
            }}
          />
        </div>

        {/* Info */}
        <div
          style={{
            flex: 1,
            padding: "18px 20px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            {/* Casa + Estado */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 8,
                gap: 8,
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#002d44",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                {reserva.casa_nombre || "Casa"}
              </h3>
              <BadgeEstado estado={reserva.estado} />
            </div>

            {/* Huésped */}
            <div
              style={{
                fontSize: 13,
                color: "#5aabb8",
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <i className="bi bi-person-circle" />
              <span>{guestNombre}</span>
              {reserva.noches && (
                <>
                  <span>•</span>
                  <span>
                    {reserva.noches} noche{reserva.noches > 1 ? "s" : ""}
                  </span>
                </>
              )}
            </div>
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

          {/* Precio + Botón */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 12,
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

  useEffect(() => {
    const fetchReservas = async () => {
      if (!user?.host_id) {
        setLoading(false);
        return;
      }

      try {
        // Obtener todas las reservas y filtrar las de las casas del host
        const todasReservas = await reservasService.getReservas();
        
        // TODO: Aquí necesitarías un endpoint específico en el backend
        // Por ahora, filtramos manualmente (no es óptimo en producción)
        const ordenadas = [...todasReservas].reverse();

        // Enriquecer con imágenes
        const reservasConImagen = await Promise.all(
          ordenadas.map(async (reserva) => {
            try {
              const imagenes = await casaImagenesService.getImagenesPorCasa(
                reserva.casa_id
              );
              const principal =
                imagenes.find((img) => img.es_principal) ?? imagenes[0];
              return { ...reserva, imagen_principal: principal?.url ?? null };
            } catch {
              return { ...reserva, imagen_principal: null };
            }
          })
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

  const reservasFiltradas =
    filtro === "todas"
      ? reservas
      : reservas.filter((r) => r.estado === filtro);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk { 
          background: linear-gradient(90deg, #e8f6ff 25%, #d0eefa 50%, #e8f6ff 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          paddingTop: 90,
          paddingBottom: 60,
          background: "linear-gradient(180deg, #edfaff 0%, #f5feff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 32,
                fontWeight: 800,
                color: "#002d44",
                margin: "0 0 8px",
              }}
            >
              Reservas Recibidas 📅
            </h1>
            <p style={{ color: "#5aabb8", margin: 0, fontSize: 15 }}>
              Gestiona las reservas de tus propiedades
            </p>
          </div>

          {/* Filtros */}
          <div
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 24,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {FILTROS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                style={{
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: 10,
                  background:
                    filtro === f.key
                      ? "linear-gradient(135deg, #00c6f0, #0090c8)"
                      : "#fff",
                  color: filtro === f.key ? "#fff" : "#5aabb8",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  boxShadow:
                    filtro === f.key
                      ? "0 4px 16px rgba(0,180,230,0.25)"
                      : "0 2px 8px rgba(0,140,190,0.08)",
                  fontFamily: "inherit",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Lista de reservas */}
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : reservasFiltradas.length === 0 ? (
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
                style={{ fontSize: 48, display: "block", marginBottom: 16 }}
              >
                📭
              </span>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  color: "#002d44",
                  marginBottom: 8,
                }}
              >
                {filtro === "todas"
                  ? "No tienes reservas"
                  : `No hay reservas ${FILTROS.find((f) => f.key === filtro)?.label.toLowerCase()}`}
              </h3>
              <p style={{ color: "#5aabb8", fontSize: 14, margin: 0 }}>
                {filtro === "todas"
                  ? "Las reservas de tus propiedades aparecerán aquí"
                  : "Cambia de filtro para ver otras reservas"}
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {reservasFiltradas.map((reserva) => (
                <ReservaCard key={reserva.id} reserva={reserva} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
