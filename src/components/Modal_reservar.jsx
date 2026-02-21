import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import reservasService from "../api/reservas_service";
import { useAuth } from "../context/AuthContext";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80";

const COMISION = 0.10; // 10%

export default function Modal_reservar({ show, onClose, casa }) {
  const { user } = useAuth();

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [loading, setLoading] = useState(false);
  const [calculo, setCalculo] = useState(null);

  // Recalcular totales cuando cambian fechas
  useEffect(() => {
    if (!fechaInicio || !fechaFin || !casa) { setCalculo(null); return; }
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);
    const noches = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    if (noches <= 0) { setCalculo(null); return; }
    const precioPorNoche = parseFloat(casa.precio);
    const subtotal = noches * precioPorNoche;
    const comision = subtotal * COMISION;
    const total = subtotal + comision;
    setCalculo({ noches, precioPorNoche, subtotal, comision, total });
  }, [fechaInicio, fechaFin, casa]);

  // Reset al abrir/cerrar
  useEffect(() => {
    if (!show) {
      setFechaInicio("");
      setFechaFin("");
      setCalculo(null);
    }
  }, [show]);

  const hoy = new Date().toISOString().split("T")[0];

  const handleReservar = async () => {
    if (!calculo) { toast.error("Selecciona fechas válidas"); return; }
    if (!user?.persona_id) {
      toast.error("Tu cuenta no tiene un perfil de persona asociado. Contacta al soporte.");
      return;
    }

    setLoading(true);
    try {
      await reservasService.crearReserva({
        casa_id: casa.id,
        guest_id: user.persona_id,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        noches: calculo.noches,
        precio_por_noche: calculo.precioPorNoche,
        subtotal: calculo.subtotal,
        comision_plataforma: calculo.comision,
        total: calculo.total,
        moneda: "USD",
        estado: "pendiente_pago",
      });
      toast.success("¡Reserva creada exitosamente!");
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al crear la reserva");
    } finally {
      setLoading(false);
    }
  };

  if (!show || !casa) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1040,
          background: "rgba(0,20,40,0.55)", backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1050,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, pointerEvents: "none",
      }}>
        <div
          style={{
            width: "100%", maxWidth: 480, background: "#fff",
            borderRadius: 20, overflow: "hidden", pointerEvents: "all",
            boxShadow: "0 24px 80px rgba(0,140,200,0.25)",
            animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1)",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {/* Header con imagen */}
          <div style={{ position: "relative", height: 160, overflow: "hidden", background: "#e8f6ff" }}>
            <img
              src={casa.foto_url || IMAGEN_GENERICA}
              alt={casa.nombre}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.src = IMAGEN_GENERICA; }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,20,40,0.7) 0%, transparent 60%)",
            }} />
            <div style={{ position: "absolute", bottom: 14, left: 18, right: 48 }}>
              <h3 style={{ margin: 0, color: "#fff", fontSize: 18, fontWeight: 800,
                fontFamily: "'Syne', sans-serif" }}>
                {casa.nombre}
              </h3>
              <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: 13, marginTop: 2 }}>
                📍 {casa.direccion}
              </p>
            </div>
            {/* Cerrar */}
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 12, right: 12,
                width: 32, height: 32, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)",
                border: "1px solid rgba(255,255,255,0.3)", color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16, fontWeight: 700,
              }}
            >
              ✕
            </button>
          </div>

          {/* Cuerpo */}
          <div style={{ padding: "24px 24px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <span style={{ fontSize: 13, color: "#5aabb8", fontWeight: 500 }}>Precio base</span>
              <span style={{ fontSize: 20, fontWeight: 800, color: "#002d44" }}>
                ${parseFloat(casa.precio).toFixed(2)}
                <span style={{ fontSize: 13, fontWeight: 400, color: "#8bb8c8" }}> /noche</span>
              </span>
            </div>

            {/* Fechas */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Llegada</label>
                <input
                  type="date"
                  min={hoy}
                  value={fechaInicio}
                  onChange={(e) => {
                    setFechaInicio(e.target.value);
                    if (fechaFin && e.target.value >= fechaFin) setFechaFin("");
                  }}
                  style={inputStyle}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Salida</label>
                <input
                  type="date"
                  min={fechaInicio || hoy}
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Resumen de costos */}
            {calculo ? (
              <div style={{
                background: "rgba(0,180,230,0.06)", borderRadius: 12,
                padding: "14px 16px", marginBottom: 20,
                border: "1px solid rgba(0,180,230,0.15)",
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <FilaCosto
                    label={`${calculo.noches} noche${calculo.noches > 1 ? "s" : ""} × $${calculo.precioPorNoche.toFixed(2)}`}
                    valor={`$${calculo.subtotal.toFixed(2)}`}
                  />
                  <FilaCosto
                    label="Comisión de servicio (10%)"
                    valor={`$${calculo.comision.toFixed(2)}`}
                    muted
                  />
                  <div style={{ borderTop: "1px solid rgba(0,180,230,0.2)", paddingTop: 8, marginTop: 2 }}>
                    <FilaCosto
                      label="Total"
                      valor={`$${calculo.total.toFixed(2)}`}
                      bold
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                background: "rgba(0,180,230,0.04)", borderRadius: 12,
                padding: "14px 16px", marginBottom: 20, textAlign: "center",
                border: "1px dashed rgba(0,180,230,0.2)",
                color: "#8bb8c8", fontSize: 13,
              }}>
                Selecciona las fechas para ver el costo total
              </div>
            )}

            {/* Botón */}
            <button
              onClick={handleReservar}
              disabled={!calculo || loading}
              style={{
                width: "100%", padding: "13px", border: "none", borderRadius: 12,
                fontFamily: "'DM Sans', sans-serif", fontWeight: 700, fontSize: 15,
                cursor: (!calculo || loading) ? "not-allowed" : "pointer",
                transition: "all 0.2s",
                background: (!calculo || loading)
                  ? "rgba(0,180,230,0.25)"
                  : "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                color: "#fff",
                boxShadow: (!calculo || loading) ? "none" : "0 6px 20px rgba(0,180,230,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Procesando...
                </>
              ) : calculo ? (
                `Reservar por $${calculo.total.toFixed(2)}`
              ) : (
                "Selecciona las fechas"
              )}
            </button>

            <p style={{ textAlign: "center", fontSize: 11, color: "#aac8d6", marginTop: 10 }}>
              No se te cobrará nada todavía
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        input[type="date"]:focus { outline: none; border-color: #00b4e6 !important; box-shadow: 0 0 0 3px rgba(0,180,230,0.14); }
      `}</style>
    </>
  );
}

function FilaCosto({ label, valor, muted, bold }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 13, color: muted ? "#8bb8c8" : "#5a7a8a" }}>{label}</span>
      <span style={{ fontSize: bold ? 16 : 14, fontWeight: bold ? 800 : 500,
        color: bold ? "#002d44" : "#003a56" }}>
        {valor}
      </span>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#007aaa", marginBottom: 6,
};

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px",
  fontSize: 14, borderRadius: 10, color: "#003a56",
  border: "1.5px solid rgba(0,180,230,0.25)", background: "#fff",
  fontFamily: "inherit", transition: "all 0.2s",
};