import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import casasService from "../api/casas_service";

const inputStyle = {
  width: "100%", boxSizing: "border-box", padding: "10px 14px",
  fontSize: 14, borderRadius: 10, color: "#003a56",
  border: "1.5px solid rgba(0,180,230,0.25)", background: "#fff",
  fontFamily: "inherit", transition: "all 0.2s", outline: "none",
};

const labelStyle = {
  display: "block", fontSize: 11, fontWeight: 700,
  letterSpacing: "0.08em", textTransform: "uppercase",
  color: "#007aaa", marginBottom: 6,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Modal_casa_host({ show, onClose, casa, hostId, onSuccess }) {
  const esEditar = !!casa;

  const [form, setForm] = useState({
    nombre: "", descripcion: "", direccion: "",
    precio: "", disponibilidad: "disponible", estado: "activa",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) return;
    if (esEditar && casa) {
      setForm({
        nombre: casa.nombre || "",
        descripcion: casa.descripcion || "",
        direccion: casa.direccion || "",
        precio: casa.precio || "",
        disponibilidad: casa.disponibilidad || "disponible",
        estado: casa.estado || "activa",
      });
    } else {
      setForm({ nombre: "", descripcion: "", direccion: "",
        precio: "", disponibilidad: "disponible", estado: "activa" });
    }
  }, [show, casa]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre || !form.direccion || !form.precio) {
      toast.error("Nombre, dirección y precio son requeridos");
      return;
    }
    setLoading(true);
    try {
      const data = {
        ...form,
        precio: parseFloat(form.precio),
        host_id: hostId,
      };
      if (esEditar) {
        await casasService.editarCasa(casa.id, data);
        toast.success("Casa actualizada correctamente");
      } else {
        await casasService.crearCasa(data);
        toast.success("Casa creada correctamente");
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error al guardar la casa");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 1040,
        background: "rgba(0,20,40,0.5)", backdropFilter: "blur(4px)",
        animation: "fadeIn 0.2s ease",
      }} />

      {/* Modal */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 1050,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20, pointerEvents: "none",
      }}>
        <div style={{
          width: "100%", maxWidth: 520, background: "#fff",
          borderRadius: 20, overflow: "hidden", pointerEvents: "all",
          boxShadow: "0 24px 80px rgba(0,140,200,0.25)",
          animation: "slideUp 0.3s cubic-bezier(.22,1,.36,1)",
          fontFamily: "'DM Sans', sans-serif",
          maxHeight: "90vh", overflowY: "auto",
        }}>

          {/* Header */}
          <div style={{
            padding: "22px 24px 18px",
            borderBottom: "1px solid rgba(0,180,230,0.12)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18,
                fontWeight: 800, color: "#002d44", margin: 0 }}>
                {esEditar ? `Editar "${casa.nombre}"` : "Nueva casa"}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "#5aabb8", marginTop: 3 }}>
                {esEditar ? "Modifica los datos de tu propiedad" : "Agrega una nueva propiedad a tu perfil"}
              </p>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "rgba(0,180,230,0.1)", border: "none",
              color: "#0090c8", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: "22px 24px 24px" }}>

            <Field label="Nombre de la propiedad">
              <input name="nombre" value={form.nombre} onChange={handleChange}
                placeholder="Ej: Casa de playa en Mancora" style={inputStyle} />
            </Field>

            <Field label="Descripción">
              <textarea name="descripcion" value={form.descripcion} onChange={handleChange}
                placeholder="Describe tu propiedad..." rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
            </Field>

            <Field label="Dirección">
              <input name="direccion" value={form.direccion} onChange={handleChange}
                placeholder="Ej: Av. Las Palmeras 123, Lima" style={inputStyle} />
            </Field>

            <Field label="Precio por noche (USD)">
              <input name="precio" type="number" min="1" step="0.01"
                value={form.precio} onChange={handleChange}
                placeholder="0.00" style={inputStyle} />
            </Field>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <Field label="Disponibilidad">
                  <select name="disponibilidad" value={form.disponibilidad}
                    onChange={handleChange} style={inputStyle}>
                    <option value="disponible">Disponible</option>
                    <option value="ocupada">Ocupada</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </Field>
              </div>
              <div style={{ flex: 1 }}>
                <Field label="Estado">
                  <select name="estado" value={form.estado}
                    onChange={handleChange} style={inputStyle}>
                    <option value="activa">Activa</option>
                    <option value="inactiva">Inactiva</option>
                    <option value="suspendida">Suspendida</option>
                  </select>
                </Field>
              </div>
            </div>

            {/* Botones */}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button type="button" onClick={onClose} style={{
                flex: 1, padding: "11px", borderRadius: 10, border: "1.5px solid rgba(0,180,230,0.25)",
                background: "#fff", color: "#5aabb8", fontSize: 14, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}>
                Cancelar
              </button>
              <button type="submit" disabled={loading} style={{
                flex: 2, padding: "11px", borderRadius: 10, border: "none",
                background: loading ? "rgba(0,180,230,0.35)" : "linear-gradient(135deg, #00c6f0, #0090c8)",
                color: "#fff", fontSize: 14, fontWeight: 700,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", display: "flex", alignItems: "center",
                justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : "0 4px 16px rgba(0,180,230,0.35)",
              }}>
                {loading ? (
                  <><div style={{ width: 15, height: 15, border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                  Guardando...</>
                ) : esEditar ? "Guardar cambios" : "Crear casa"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}