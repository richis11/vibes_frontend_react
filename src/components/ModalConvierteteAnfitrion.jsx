import { useState } from "react";
import { toast } from "react-toastify";
import hostsService from "../api/hosts_service";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ModalConvierteAnfitrion({ show, onClose }) {
  const { user, login, token } = useAuth();
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  const handleConvertirse = async () => {
    if (!aceptaTerminos) {
      toast.warning("Debes aceptar los términos y condiciones");
      return;
    }

    setLoading(true);
    try {
      const response = await hostsService.crearHost({
        persona_id: user.persona_id,
        verificado: false,
      });

      // Actualizar contexto correctamente sin reload
      const updatedUser = {
        ...user,
        host_id: response.data.host_id,
      };

      login(token, updatedUser); // Actualiza localStorage + estado React


      toast.success("¡Felicidades! Ahora eres anfitrión de Vibes 🎉");


      navigate("/mi-panel"); // Redirigir a panel de anfitrión
      
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Error al crear perfil de anfitrión. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };


  if (!show) return null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1040,
          background: "rgba(0,20,40,0.6)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 1050,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
          pointerEvents: "none",
        }}
      >
        <div className="modal-scroll"
          style={{
            width: "100%",
            maxWidth: 580,
            background: "#fff",
            borderRadius: 20,
            overflow: "hidden",
            pointerEvents: "all",
            boxShadow: "0 24px 80px rgba(0,140,200,0.3)",
            animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1)",
            fontFamily: "'DM Sans', sans-serif",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "28px 32px 24px",
              background: "linear-gradient(135deg, #edfaff 0%, #d0eefa 100%)",
              borderBottom: "1px solid rgba(0,180,230,0.15)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#002d44",
                    margin: "0 0 8px",
                  }}
                >
                  🏠 Conviértete en Anfitrión
                </h2>
                <p style={{ color: "#5aabb8", margin: 0, fontSize: 15 }}>
                  Comparte tu espacio y genera ingresos
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  background: "none",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  color: "#5aabb8",
                  fontSize: 28,
                  lineHeight: 1,
                  padding: 0,
                  transition: "color 0.2s",
                  opacity: loading ? 0.5 : 1,
                }}
                onMouseEnter={(e) => !loading && (e.target.style.color = "#0090c8")}
                onMouseLeave={(e) => (e.target.style.color = "#5aabb8")}
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div style={{ padding: "32px" }}>
            {/* Beneficios */}
            <div style={{ marginBottom: 28 }}>
              <h3
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#002d44",
                  marginBottom: 16,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                ✨ Beneficios de ser Anfitrión
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  {
                    icon: "💰",
                    title: "Genera ingresos extras",
                    desc: "Monetiza tu propiedad cuando no la uses",
                  },
                  {
                    icon: "📅",
                    title: "Tú decides",
                    desc: "Control total sobre disponibilidad y precios",
                  },
                  {
                    icon: "🛡️",
                    title: "Protección incluida",
                    desc: "Cobertura ante daños y soporte 24/7",
                  },
                  {
                    icon: "🌟",
                    title: "Comunidad global",
                    desc: "Conecta con viajeros de todo el mundo",
                  },
                ].map((beneficio, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      gap: 12,
                      padding: 14,
                      background: "rgba(0,180,230,0.04)",
                      borderRadius: 12,
                      border: "1px solid rgba(0,180,230,0.08)",
                    }}
                  >
                    <span style={{ fontSize: 24 }}>{beneficio.icon}</span>
                    <div>
                      <div
                        style={{
                          fontSize: 15,
                          fontWeight: 600,
                          color: "#002d44",
                          marginBottom: 2,
                        }}
                      >
                        {beneficio.title}
                      </div>
                      <div style={{ fontSize: 13, color: "#5aabb8" }}>
                        {beneficio.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Términos y Condiciones */}
            <div
              style={{
                padding: 20,
                background: "#f8f9fa",
                borderRadius: 12,
                border: "1.5px solid rgba(0,180,230,0.15)",
                marginBottom: 24,
              }}
            >
              <h4
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#002d44",
                  marginBottom: 12,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                📋 Términos y Condiciones
              </h4>
              <div
                style={{
                  fontSize: 13,
                  color: "#5aabb8",
                  lineHeight: 1.6,
                  maxHeight: 180,
                  overflowY: "auto",
                  paddingRight: 8,
                }}
              >
                <p style={{ margin: "0 0 10px" }}>
                  Al convertirte en anfitrión de Vibes, aceptas:
                </p>
                <ul style={{ margin: "0 0 10px", paddingLeft: 20 }}>
                  <li>Proporcionar información veraz sobre tu propiedad</li>
                  <li>Mantener tu calendario actualizado</li>
                  <li>Responder a las solicitudes de reserva en 24 horas</li>
                  <li>Cumplir con las normativas locales de alquiler</li>
                  <li>Respetar las políticas de cancelación establecidas</li>
                  <li>Mantener estándares de limpieza y seguridad</li>
                </ul>
                <p style={{ margin: "10px 0 0", fontSize: 12, fontStyle: "italic" }}>
                  Vibes se reserva el derecho de suspender cuentas que no cumplan
                  con estos términos.
                </p>
              </div>
            </div>

            {/* Checkbox de aceptación */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                cursor: "pointer",
                marginBottom: 24,
                padding: 12,
                borderRadius: 10,
                background: aceptaTerminos
                  ? "rgba(0,180,230,0.08)"
                  : "transparent",
                border: `1.5px solid ${
                  aceptaTerminos
                    ? "rgba(0,180,230,0.3)"
                    : "rgba(0,180,230,0.15)"
                }`,
                transition: "all 0.2s",
              }}
            >
              <input
                type="checkbox"
                checked={aceptaTerminos}
                onChange={(e) => setAceptaTerminos(e.target.checked)}
                style={{
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  accentColor: "#00b4e6",
                  marginTop: 2,
                }}
              />
              <span style={{ fontSize: 14, color: "#002d44", lineHeight: 1.5 }}>
                He leído y acepto los términos y condiciones para ser anfitrión
                de Vibes
              </span>
            </label>

            {/* Botones */}
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={onClose}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "1.5px solid rgba(0,180,230,0.3)",
                  borderRadius: 12,
                  background: "#fff",
                  color: "#0090c8",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConvertirse}
                disabled={!aceptaTerminos || loading}
                style={{
                  flex: 1,
                  padding: "14px",
                  border: "none",
                  borderRadius: 12,
                  background:
                    !aceptaTerminos || loading
                      ? "rgba(0,180,230,0.3)"
                      : "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                  color: "#fff",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor:
                    !aceptaTerminos || loading ? "not-allowed" : "pointer",
                  boxShadow:
                    aceptaTerminos && !loading
                      ? "0 6px 20px rgba(0,180,230,0.38)"
                      : "none",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        border: "2px solid rgba(255,255,255,0.3)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Procesando...
                  </>
                ) : (
                  "Aceptar y Continuar"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}
