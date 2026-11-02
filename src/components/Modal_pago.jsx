import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import pagosService from "../api/pagos_service";
import { mensajeError } from "../utils/mensajeError";
import { DATOS_TRANSFERENCIA } from "../config/datosTransferencia";

const MAX_MB = 5;
const HORAS_PARA_PAGAR = 24; // igual que en el backend (vencimiento.service.ts)

// reserva: { id, total, moneda, casa_nombre }
export default function Modal_pago({ show, onClose, reserva, onEnviado }) {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [referencia, setReferencia] = useState("");
  const [enviando, setEnviando] = useState(false);

  const cargarPagos = () => {
    setCargando(true);
    pagosService
      .getPagosDeReserva(reserva.id)
      .then(setPagos)
      .catch(() => setPagos([]))
      .finally(() => setCargando(false));
  };

  useEffect(() => {
    if (show && reserva) cargarPagos();
    if (!show) {
      setArchivo(null);
      setReferencia("");
    }
  }, [show, reserva?.id]);

  useEffect(() => {
    if (!archivo) { setPreview(null); return; }
    const url = URL.createObjectURL(archivo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [archivo]);

  const elegirArchivo = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Sube una foto o captura del comprobante");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`La imagen no puede pesar más de ${MAX_MB} MB`);
      return;
    }
    setArchivo(file);
  };

  const enviar = async () => {
    if (!archivo) return;
    setEnviando(true);
    try {
      const data = await pagosService.subirComprobante(reserva.id, archivo, referencia);
      toast.success(data.message || "Comprobante enviado");
      setArchivo(null);
      setReferencia("");
      cargarPagos();
      onEnviado?.();
    } catch (err) {
      toast.error(mensajeError(err, "No se pudo enviar el comprobante"));
    } finally {
      setEnviando(false);
    }
  };

  const copiar = (texto) => {
    navigator.clipboard?.writeText(texto).then(
      () => toast.info("Copiado", { autoClose: 1200 }),
      () => {},
    );
  };

  if (!show || !reserva) return null;

  const ultimo = pagos[0];
  const enRevision = ultimo?.estado === "en_revision";
  const aprobado = ultimo?.estado === "aprobado";
  const rechazado = ultimo?.estado === "rechazado";
  const total = parseFloat(reserva.total ?? 0).toFixed(2);

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1040,
          background: "rgba(0,20,40,0.55)", backdropFilter: "blur(4px)",
          animation: "fadeIn 0.2s ease",
        }}
      />

      <div style={{
        position: "fixed", inset: 0, zIndex: 1050,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, pointerEvents: "none",
      }}>
        <div className="modal-scroll" style={{
          width: "100%", maxWidth: 480, background: "#fff",
          borderRadius: 20, overflowX: "hidden", overflowY: "auto",
          maxHeight: "calc(100vh - 40px)", pointerEvents: "all",
          boxShadow: "0 24px 80px rgba(0,140,200,0.25)",
          animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {/* Header */}
          <div style={{
            padding: "20px 24px", position: "relative",
            background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)", color: "#fff",
          }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", opacity: 0.85 }}>
              Pago por transferencia o depósito
            </p>
            <h3 style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 800,
              fontFamily: "'Syne', sans-serif", paddingRight: 36 }}>
              {reserva.casa_nombre || `Reserva #${reserva.id}`}
            </h3>
            <button onClick={onClose} style={botonCerrar}>✕</button>
          </div>

          <div style={{ padding: "20px 24px 24px" }}>
            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
              marginBottom: 18 }}>
              <span style={{ fontSize: 13, color: "#5aabb8", fontWeight: 500 }}>Total a pagar</span>
              <span style={{ fontSize: 24, fontWeight: 800, color: "#002d44" }}>
                ${total} <span style={{ fontSize: 13, fontWeight: 500, color: "#8bb8c8" }}>{reserva.moneda}</span>
              </span>
            </div>

            {cargando ? (
              <p style={{ textAlign: "center", color: "#8bb8c8", fontSize: 14 }}>Cargando…</p>
            ) : aprobado ? (
              <Aviso color="#16a34a" bg="rgba(22,163,74,0.08)" icono="✅" titulo="Pago aprobado">
                Tu reserva está pagada. ¡Gracias!
              </Aviso>
            ) : enRevision ? (
              <Aviso color="#d97706" bg="rgba(217,119,6,0.08)" icono="⏳" titulo="Comprobante en revisión">
                Lo recibimos y lo estamos verificando. Te avisaremos cuando la reserva quede pagada.
                {ultimo.comprobante_url && (
                  <div style={{ marginTop: 8 }}>
                    <a href={ultimo.comprobante_url} target="_blank" rel="noreferrer"
                      style={{ color: "#0090c8", fontWeight: 600 }}>
                      Ver comprobante enviado
                    </a>
                  </div>
                )}
              </Aviso>
            ) : (
              <>
                {rechazado && (
                  <Aviso color="#ef4444" bg="rgba(239,68,68,0.07)" icono="⚠️" titulo="Comprobante rechazado">
                    {ultimo.motivo_rechazo || "No pudimos verificar el pago."} Sube un comprobante nuevo.
                  </Aviso>
                )}

                {/* Paso 1 */}
                <p style={{ fontSize: 12, color: "#d97706", background: "rgba(217,119,6,0.08)",
                  borderRadius: 10, padding: "8px 12px", margin: "0 0 16px" }}>
                  ⏱ Tienes {HORAS_PARA_PAGAR} horas para enviar el comprobante; si no, la
                  reserva se cancela y las fechas se liberan.
                </p>

                <p style={paso}>1. Transfiere o deposita el total a esta cuenta</p>
                <div style={{
                  background: "rgba(0,180,230,0.06)", borderRadius: 12,
                  border: "1px solid rgba(0,180,230,0.15)", padding: "6px 14px", marginBottom: 18,
                }}>
                  {DATOS_TRANSFERENCIA.map((d) => (
                    <div key={d.label} style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "center", gap: 10, padding: "7px 0",
                      borderBottom: "1px solid rgba(0,180,230,0.08)" }}>
                      <span style={{ fontSize: 12, color: "#5a7a8a" }}>{d.label}</span>
                      <button onClick={() => copiar(d.valor)} title="Copiar" style={botonCopiar}>
                        {d.valor} <span style={{ opacity: 0.5, fontSize: 11 }}>⧉</span>
                      </button>
                    </div>
                  ))}
                  <p style={{ fontSize: 11, color: "#8bb8c8", margin: "8px 0 4px" }}>
                    En el concepto escribe: <b>Reserva #{reserva.id}</b>
                  </p>
                </div>

                {/* Paso 2 */}
                <p style={paso}>2. Sube la foto o captura del comprobante</p>
                <label style={{
                  display: "block", cursor: "pointer", marginBottom: 12,
                  border: "1.5px dashed rgba(0,180,230,0.35)", borderRadius: 12,
                  padding: preview ? 8 : "22px 12px", textAlign: "center",
                  color: "#5aabb8", fontSize: 13, background: "#fff",
                }}>
                  <input type="file" accept="image/*" onChange={elegirArchivo} style={{ display: "none" }} />
                  {preview ? (
                    <>
                      <img src={preview} alt="Comprobante"
                        style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8, display: "block", margin: "0 auto" }} />
                      <span style={{ display: "block", marginTop: 6, fontSize: 12 }}>Toca para cambiar la imagen</span>
                    </>
                  ) : (
                    <>📎 Elegir imagen <span style={{ display: "block", fontSize: 11, color: "#aac8d6", marginTop: 4 }}>JPG o PNG, máx. {MAX_MB} MB</span></>
                  )}
                </label>

                <label style={labelStyle}>Nº de comprobante (opcional)</label>
                <input
                  type="text"
                  maxLength={100}
                  value={referencia}
                  onChange={(e) => setReferencia(e.target.value)}
                  placeholder="Ej. 123456789"
                  style={{ ...inputStyle, marginBottom: 18 }}
                />

                <button
                  onClick={enviar}
                  disabled={!archivo || enviando}
                  style={{
                    width: "100%", padding: 13, border: "none", borderRadius: 12,
                    fontFamily: "inherit", fontWeight: 700, fontSize: 15, color: "#fff",
                    cursor: !archivo || enviando ? "not-allowed" : "pointer",
                    background: !archivo || enviando
                      ? "rgba(0,180,230,0.25)"
                      : "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                    boxShadow: !archivo || enviando ? "none" : "0 6px 20px rgba(0,180,230,0.4)",
                  }}
                >
                  {enviando ? "Enviando…" : "Enviar comprobante"}
                </button>
                <p style={{ textAlign: "center", fontSize: 11, color: "#aac8d6", marginTop: 10, marginBottom: 0 }}>
                  Tu reserva queda pendiente hasta que verifiquemos el pago.
                  También puedes pagar más tarde desde "Mis reservas".
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
    </>
  );
}

function Aviso({ color, bg, icono, titulo, children }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: "12px 14px", marginBottom: 18,
      border: `1px solid ${color}33` }}>
      <p style={{ margin: 0, fontWeight: 700, color, fontSize: 14 }}>{icono} {titulo}</p>
      <div style={{ fontSize: 13, color: "#5a7a8a", marginTop: 4 }}>{children}</div>
    </div>
  );
}

const botonCerrar = {
  position: "absolute", top: 14, right: 14,
  width: 32, height: 32, borderRadius: "50%",
  background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
  color: "#fff", cursor: "pointer", fontSize: 16, fontWeight: 700,
};

const botonCopiar = {
  border: "none", background: "transparent", padding: 0, cursor: "pointer",
  fontFamily: "inherit", fontSize: 13, fontWeight: 600, color: "#003a56", textAlign: "right",
};

const paso = { fontSize: 13, fontWeight: 700, color: "#002d44", margin: "0 0 8px" };

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#007aaa", marginBottom: 6,
};

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 12px",
  fontSize: 14, borderRadius: 10, color: "#003a56",
  border: "1.5px solid rgba(0,180,230,0.25)", background: "#fff",
  fontFamily: "inherit",
};
