import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import casasService from "../api/casas_service";
import Modal_reservar from "../components/Modal_reservar";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80";

function InfoChip({ icon, label, value }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "rgba(0,180,230,0.07)",
        borderRadius: 12,
        padding: "12px 16px",
        flex: "1 1 180px",
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#007aaa",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: "#002d44",
            marginTop: 2,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

const estadoBadge = {
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
  eliminada: {
    label: "Eliminada",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
};

const dispBadge = {
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

function Badge({ tipo, valor }) {
  const map = tipo === "estado" ? estadoBadge : dispBadge;
  const d = map[valor] ?? { label: valor, color: "#666", bg: "#eee" };
  return (
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        padding: "4px 12px",
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

export default function Detalle_casa() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [casa, setCasa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchCasa = async () => {
      try {
        const data = await casasService.getCasa(Number(id));
        setCasa(data);
      } catch {
        toast.error("No se pudo cargar la casa");
        navigate("/casas");
      } finally {
        setLoading(false);
      }
    };
    fetchCasa();
  }, [id]);

  if (loading) return <PageSkeleton />;
  if (!casa) return null;

  const imgSrc = imgError ? IMAGEN_GENERICA : casa.foto_url || IMAGEN_GENERICA;
  const disponible =
    casa.disponibilidad === "disponible" && casa.estado === "activa";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .detalle-wrapper { animation: fadeUp 0.45s cubic-bezier(.22,1,.36,1) both; }
        .reservar-btn { transition: all 0.2s; }
        .reservar-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(0,180,230,0.48) !important; }
        .reservar-btn:active:not(:disabled) { transform: translateY(0); }
        .back-btn { transition: all 0.18s; }
        .back-btn:hover { color: #0090c8 !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          paddingTop: 76,
          paddingBottom: 60,
          background: "linear-gradient(180deg, #edfaff 0%, #f5feff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          className="detalle-wrapper"
          style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}
        >
          {/* Volver */}
          <button
            className="back-btn"
            onClick={() => navigate("/casas")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#5aabb8",
              fontSize: 14,
              fontWeight: 600,
              padding: "12px 0",
              marginBottom: 8,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Volver a casas
          </button>

          {/* Imagen principal */}
          <div
            style={{
              borderRadius: 20,
              overflow: "hidden",
              position: "relative",
              height: "clamp(220px, 40vw, 420px)",
              marginBottom: 28,
              boxShadow: "0 8px 40px rgba(0,140,200,0.18)",
            }}
          >
            <img
              src={imgSrc}
              alt={casa.nombre}
              onError={() => setImgError(true)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Gradiente inferior */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top, rgba(0,20,40,0.65) 0%, transparent 55%)",
              }}
            />
            {/* Badges sobre imagen */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                display: "flex",
                gap: 8,
              }}
            >
              <Badge tipo="estado" valor={casa.estado} />
              <Badge tipo="disp" valor={casa.disponibilidad} />
            </div>
            {/* Precio sobre imagen */}
            <div
              style={{
                position: "absolute",
                bottom: 20,
                right: 20,
                background: "rgba(0,20,40,0.75)",
                backdropFilter: "blur(8px)",
                borderRadius: 12,
                padding: "8px 16px",
                color: "#fff",
              }}
            >
              <span style={{ fontSize: 11, opacity: 0.75 }}>desde </span>
              <span style={{ fontSize: 24, fontWeight: 800 }}>
                ${parseFloat(casa.precio).toFixed(0)}
              </span>
              <span style={{ fontSize: 12, opacity: 0.75 }}> /noche</span>
            </div>
          </div>

          {/* Layout: info izq + card reserva der */}
          <div
            style={{
              display: "flex",
              gap: 28,
              alignItems: "flex-start",
              flexWrap: "wrap",
            }}
          >
            {/* Columna izquierda — info */}
            <div style={{ flex: "1 1 480px", minWidth: 0 }}>
              <h1
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(22px, 3.5vw, 32px)",
                  fontWeight: 800,
                  color: "#002d44",
                  letterSpacing: "-0.02em",
                  margin: "0 0 8px",
                }}
              >
                {casa.nombre}
              </h1>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  color: "#5aabb8",
                  fontSize: 14,
                  marginBottom: 20,
                }}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {casa.direccion}
              </div>

              {/* Chips info */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 10,
                  marginBottom: 24,
                }}
              >
                <InfoChip
                  icon="💰"
                  label="Precio / noche"
                  value={`$${parseFloat(casa.precio).toFixed(2)}`}
                />
                <InfoChip
                  icon="🏡"
                  label="Disponibilidad"
                  value={casa.disponibilidad}
                />
                <InfoChip icon="✅" label="Estado" value={casa.estado} />
              </div>

              {/* Descripción */}
              {casa.descripcion && (
                <div style={{ marginBottom: 24 }}>
                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 17,
                      fontWeight: 800,
                      color: "#002d44",
                      marginBottom: 10,
                    }}
                  >
                    Acerca de este lugar
                  </h2>
                  <p
                    style={{
                      fontSize: 15,
                      color: "#4a7a8a",
                      lineHeight: 1.75,
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {casa.descripcion}
                  </p>
                </div>
              )}

              {/* Sección placeholder: más detalles a futuro */}
              <div
                style={{
                  border: "1.5px dashed rgba(0,180,230,0.25)",
                  borderRadius: 14,
                  padding: "18px 20px",
                  color: "#8bb8c8",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 20 }}>🖼️</span>
                <span>Más imágenes y detalles del espacio próximamente</span>
              </div>
            </div>

            {/* Columna derecha — card reserva */}
            <div
              style={{
                flex: "0 0 280px",
                position: "sticky",
                top: 90,
                background: "#fff",
                borderRadius: 18,
                border: "1.5px solid rgba(0,180,230,0.18)",
                boxShadow: "0 8px 32px rgba(0,140,200,0.12)",
                padding: "24px 22px",
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 16 }}>
                <span
                  style={{ fontSize: 28, fontWeight: 800, color: "#002d44" }}
                >
                  ${parseFloat(casa.precio).toFixed(2)}
                </span>
                <span style={{ fontSize: 14, color: "#8bb8c8" }}> /noche</span>
              </div>

              {disponible ? (
                <>
                  <p
                    style={{
                      fontSize: 13,
                      color: "#5aabb8",
                      textAlign: "center",
                      marginBottom: 18,
                      lineHeight: 1.5,
                    }}
                  >
                    Este espacio está disponible. ¡Reserva ahora y asegura tus
                    fechas!
                  </p>
                  <button
                    className="reservar-btn"
                    onClick={() => setShowModal(true)}
                    style={{
                      width: "100%",
                      padding: "13px",
                      border: "none",
                      borderRadius: 12,
                      background:
                        "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 6px 20px rgba(0,180,230,0.38)",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Reservar ahora
                  </button>
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 11,
                      color: "#aac8d6",
                      marginTop: 10,
                    }}
                  >
                    No se te cobrará nada todavía
                  </p>
                </>
              ) : (
                <div style={{ textAlign: "center" }}>
                  <span
                    style={{ fontSize: 32, display: "block", marginBottom: 10 }}
                  >
                    🚫
                  </span>
                  <p
                    style={{
                      fontSize: 14,
                      color: "#f97316",
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    No disponible
                  </p>
                  <p style={{ fontSize: 12, color: "#8bb8c8" }}>
                    Este espacio no está disponible para reservas en este
                    momento
                  </p>
                </div>
              )}

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid rgba(0,180,230,0.12)",
                  margin: "18px 0",
                }}
              />

              <div style={{ fontSize: 12, color: "#8bb8c8", lineHeight: 1.6 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                  <span>🛡️</span>
                  <span>Reserva protegida por VIBES</span>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <span>💳</span>
                  <span>Pago seguro al confirmar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal reservar */}
      <Modal_reservar
        show={showModal}
        onClose={() => setShowModal(false)}
        casa={casa}
      />
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 76,
        background: "#edfaff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes shimmer {
          0%{background-position:200% 0} 100%{background-position:-200% 0}
        }
        .sk { background: linear-gradient(90deg, #e0f4ff 25%, #c8ecfa 50%, #e0f4ff 75%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
      `}</style>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 20px" }}>
        <div
          className="sk"
          style={{ height: 20, width: 120, marginBottom: 20, marginTop: 14 }}
        />
        <div
          className="sk"
          style={{ height: 380, marginBottom: 28, borderRadius: 20 }}
        />
        <div style={{ display: "flex", gap: 28 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            {[280, 180, "100%", "100%", "85%"].map((w, i) => (
              <div
                key={i}
                className="sk"
                style={{ height: i < 2 ? 24 : 14, width: w }}
              />
            ))}
          </div>
          <div
            className="sk"
            style={{ flex: "0 0 280px", height: 260, borderRadius: 18 }}
          />
        </div>
      </div>
    </div>
  );
}
