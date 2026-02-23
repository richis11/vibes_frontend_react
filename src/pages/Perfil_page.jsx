import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import personasService from "../api/personas_service";
import { useAuth } from "../context/AuthContext";

const AVATAR_GENERICO =
  "https://ui-avatars.com/api/?background=00b4e6&color=fff&size=200&bold=true&name=";

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  fontSize: 14,
  borderRadius: 10,
  color: "#003a56",
  border: "1.5px solid rgba(0,180,230,0.25)",
  background: "#fff",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const inputDisabledStyle = {
  ...inputStyle,
  background: "rgba(0,180,230,0.04)",
  color: "#7aabb8",
  cursor: "not-allowed",
};

const labelStyle = {
  display: "block",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#007aaa",
  marginBottom: 6,
};

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

export default function Perfil_page() {
  const { user, login, token } = useAuth();
  const fileInputRef = useRef();

  const [persona, setPersona] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingFoto, setUploadingFoto] = useState(false);
  const [fotoPreview, setFotoPreview] = useState(null);

  const [editando, setEditando] = useState(false);
  const [formOriginal, setFormOriginal] = useState({
    cedula: "",
    telefono: "",
    direccion: "",
  });

  const [form, setForm] = useState({
    cedula: "",
    telefono: "",
    direccion: "",
  });

  // ── Cargar datos de persona ──────────────────────────────────────────
  useEffect(() => {
    const fetch = async () => {
      if (!user?.persona_id) {
        setLoading(false);
        return;
      }
      try {
        const data = await personasService.getPersona(user.persona_id);
        setPersona(data);
        setForm({
          cedula: data.cedula || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
        });
        setFormOriginal({
          cedula: data.cedula || "",
          telefono: data.telefono || "",
          direccion: data.direccion || "",
        });
        setFotoPreview(data.foto_url || null);
      } catch {
        toast.error("Error al cargar el perfil");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditar = () => setEditando(true);

const handleCancelar = () => {
  setForm(formOriginal);   // revertir cambios
  setEditando(false);
};

  // ── Guardar datos ────────────────────────────────────────────────────
 const handleGuardar = async (e) => {
  e.preventDefault();
  setSaving(true);
  try {
    await personasService.editarPersona(user.persona_id, form);
    toast.success("Perfil actualizado correctamente");
    setPersona((prev) => ({ ...prev, ...form }));
    setFormOriginal(form);   // ← actualizar referencia
    setEditando(false);      // ← salir del modo edición
  } catch {
    toast.error("Error al guardar los cambios");
  } finally {
    setSaving(false);
  }
};

  // ── Subir foto ───────────────────────────────────────────────────────
  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("Solo imágenes");
    if (file.size > 4 * 1024 * 1024) return toast.error("Máximo 4MB");

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target.result);
    reader.readAsDataURL(file);

    setUploadingFoto(true);
    try {
      const res = await personasService.subirFoto(user.persona_id, file);
      setFotoPreview(res.foto_url);
      setPersona((prev) => ({ ...prev, foto_url: res.foto_url }));
      // Actualizar user en contexto y localStorage
      const updatedUser = { ...user, foto_url: res.foto_url };
      login(token, updatedUser);
      toast.success("Foto de perfil actualizada");
    } catch {
      toast.error("Error al subir la foto");
      setFotoPreview(persona?.foto_url || null);
    } finally {
      setUploadingFoto(false);
    }
  };

  const nombreCompleto = persona
    ? `${persona.nombres} ${persona.apellidos}`
    : (user?.nombres ?? "Usuario");

  const avatarSrc =
    fotoPreview || `${AVATAR_GENERICO}${encodeURIComponent(nombreCompleto)}`;

  if (loading) return <PageSkeleton />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .perfil-input:focus { border-color: #00b4e6 !important; box-shadow: 0 0 0 3px rgba(0,180,230,0.13); }
        .foto-btn:hover { background: rgba(0,180,230,0.18) !important; }
        .guardar-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(0,180,230,0.45) !important; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          paddingTop: 80,
          paddingBottom: 48,
          background: "linear-gradient(180deg, #edfaff 0%, #f5feff 100%)",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "0 20px",
            animation: "fadeUp 0.4s ease",
          }}
        >
          {/* Header */}
          <div style={{ marginBottom: 28 }}>
            <span
              style={{
                fontSize: 11,
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
                fontSize: "clamp(24px, 4vw, 34px)",
                fontWeight: 800,
                color: "#002d44",
                margin: "6px 0 0",
                letterSpacing: "-0.02em",
              }}
            >
              Mi Perfil
            </h1>
          </div>

          {/* Card foto + nombre */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              border: "1.5px solid rgba(0,180,230,0.12)",
              boxShadow: "0 4px 24px rgba(0,140,190,0.08)",
              padding: "28px 28px 24px",
              marginBottom: 20,
              display: "flex",
              alignItems: "center",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            {/* Avatar + botón cambiar */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid rgba(0,180,230,0.25)",
                  boxShadow: "0 4px 16px rgba(0,180,230,0.2)",
                }}
              >
                <img
                  src={avatarSrc}
                  alt="Foto de perfil"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = `${AVATAR_GENERICO}${encodeURIComponent(nombreCompleto)}`;
                  }}
                />
              </div>
              {/* Overlay subiendo */}
              {uploadingFoto && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: "rgba(0,20,40,0.5)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div
                    style={{
                      width: 22,
                      height: 22,
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      animation: "spin 0.7s linear infinite",
                    }}
                  />
                </div>
              )}
              {/* Botón cámara */}
              <button
                className="foto-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingFoto}
                style={{
                  position: "absolute",
                  bottom: 2,
                  right: 2,
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#00b4e6",
                  border: "2px solid #fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  boxShadow: "0 2px 8px rgba(0,180,230,0.4)",
                  transition: "background 0.2s",
                }}
              >
                📷
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFotoChange}
              />
            </div>

            {/* Nombre + email */}
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#002d44",
                  margin: "0 0 4px",
                }}
              >
                {nombreCompleto}
              </h2>
              <p style={{ color: "#5aabb8", fontSize: 14, margin: "0 0 8px" }}>
                {user?.email}
              </p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {user?.is_admin && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 99,
                      color: "#7c3aed",
                      background: "rgba(124,58,237,0.1)",
                    }}
                  >
                    👑 Admin
                  </span>
                )}
                {user?.host_id && (
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      padding: "3px 10px",
                      borderRadius: 99,
                      color: "#16a34a",
                      background: "rgba(22,163,74,0.1)",
                    }}
                  >
                    🏡 Host
                  </span>
                )}
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "3px 10px",
                    borderRadius: 99,
                    color: "#00b4e6",
                    background: "rgba(0,180,230,0.1)",
                  }}
                >
                  ✅ Activo
                </span>
              </div>
            </div>
          </div>

          {/* Formulario datos */}
          <form onSubmit={handleGuardar}>
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                border: "1.5px solid rgba(0,180,230,0.12)",
                boxShadow: "0 4px 24px rgba(0,140,190,0.08)",
                padding: "24px 28px",
                marginBottom: 20,
              }}
            >
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 15,
                  fontWeight: 800,
                  color: "#002d44",
                  margin: "0 0 20px",
                }}
              >
                Información personal
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 20px",
                }}
              >
                {/* Solo lectura */}
                <Field label="Nombres">
                  <input
                    value={persona?.nombres || ""}
                    disabled
                    style={inputDisabledStyle}
                  />
                </Field>
                <Field label="Apellidos">
                  <input
                    value={persona?.apellidos || ""}
                    disabled
                    style={inputDisabledStyle}
                  />
                </Field>
                <Field label="Fecha de nacimiento">
                  <input
                    value={
                      persona?.fecha_nacimiento
                        ? new Date(persona.fecha_nacimiento).toLocaleDateString(
                            "es-ES",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )
                        : "—"
                    }
                    disabled
                    style={inputDisabledStyle}
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={user?.email || ""}
                    disabled
                    style={inputDisabledStyle}
                  />
                </Field>
              </div>
            </div>

            <div style={{
  background: "#fff", borderRadius: 20,
  border: "1.5px solid rgba(0,180,230,0.12)",
  boxShadow: "0 4px 24px rgba(0,140,190,0.08)",
  padding: "24px 28px",
  marginBottom: editando ? 20 : 0,  // sin margen si no hay botón guardar abajo
}}>
  {/* Header con botón editar/cancelar */}
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
    <h3 style={{
      fontFamily: "'Syne', sans-serif", fontSize: 15,
      fontWeight: 800, color: "#002d44", margin: 0,
    }}>
      Datos de contacto
    </h3>

    {!editando ? (
      <button
        type="button"
        onClick={handleEditar}
        style={{
          background: "rgba(0,180,230,0.08)", border: "1.5px solid rgba(0,180,230,0.25)",
          borderRadius: 8, padding: "6px 14px", cursor: "pointer",
          fontSize: 12, fontWeight: 700, color: "#007aaa",
          fontFamily: "inherit", display: "flex", alignItems: "center", gap: 6,
          transition: "all 0.18s",
        }}
      >
        ✏️ Editar información
      </button>
    ) : (
      <button
        type="button"
        onClick={handleCancelar}
        style={{
          background: "transparent", border: "1.5px solid rgba(239,68,68,0.3)",
          borderRadius: 8, padding: "6px 14px", cursor: "pointer",
          fontSize: 12, fontWeight: 700, color: "#ef4444",
          fontFamily: "inherit", transition: "all 0.18s",
        }}
      >
        ✕ Cancelar
      </button>
    )}
  </div>

  <p style={{ fontSize: 13, color: "#5aabb8", margin: "0 0 20px" }}>
    {editando
      ? "Modifica tus datos y presiona Guardar cuando termines."
      : "Completa tu información para poder hacer reservas."}
  </p>

  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
    <Field label="Cédula / DNI">
      <input
        className="perfil-input"
        name="cedula"
        value={form.cedula}
        onChange={handleChange}
        placeholder="Ej: 1234567890"
        disabled={!editando}
        style={editando ? inputStyle : inputDisabledStyle}
      />
    </Field>
    <Field label="Teléfono">
      <input
        className="perfil-input"
        name="telefono"
        value={form.telefono}
        onChange={handleChange}
        placeholder="Ej: +52 55 1234 5678"
        disabled={!editando}
        style={editando ? inputStyle : inputDisabledStyle}
      />
    </Field>
  </div>

  <Field label="Dirección">
    <input
      className="perfil-input"
      name="direccion"
      value={form.direccion}
      onChange={handleChange}
      placeholder="Calle, número, ciudad..."
      disabled={!editando}
      style={editando ? inputStyle : inputDisabledStyle}
    />
  </Field>

  {/* Aviso campos faltantes — solo cuando NO está editando */}
  {!editando && (!form.cedula || !form.telefono || !form.direccion) && (
    <div style={{
      background: "rgba(217,119,6,0.07)",
      border: "1px solid rgba(217,119,6,0.2)",
      borderRadius: 10, padding: "10px 14px",
      fontSize: 13, color: "#d97706", marginTop: 4,
      display: "flex", alignItems: "center", gap: 8,
    }}>
      ⚠️ Completa todos los campos para poder realizar reservas sin inconvenientes.
    </div>
  )}
</div>

{/* Botón guardar — solo visible cuando está editando */}
{editando && (
  <button
    type="submit"
    className="guardar-btn"
    disabled={saving}
    style={{
      width: "100%", padding: "14px 0",
      border: "none", borderRadius: 12,
      background: saving
        ? "rgba(0,180,230,0.4)"
        : "linear-gradient(135deg, #00c6f0, #0090c8)",
      color: "#fff", fontWeight: 700, fontSize: 15,
      cursor: saving ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      boxShadow: "0 4px 18px rgba(0,180,230,0.35)",
      transition: "all 0.2s",
    }}
  >
    {saving ? "Guardando..." : "Guardar cambios"}
  </button>
)}


          </form>
        </div>
      </div>
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div
      style={{
        minHeight: "100vh",
        paddingTop: 80,
        background: "#edfaff",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        .sk { background: linear-gradient(90deg, #e0f4ff 25%, #c8ecfa 50%, #e0f4ff 75%);
          background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 12px; }
      `}</style>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 20px" }}>
        <div
          className="sk"
          style={{ height: 18, width: 80, marginBottom: 10, marginTop: 14 }}
        />
        <div
          className="sk"
          style={{ height: 36, width: 200, marginBottom: 28 }}
        />
        <div
          className="sk"
          style={{ height: 140, marginBottom: 20, borderRadius: 20 }}
        />
        <div
          className="sk"
          style={{ height: 220, marginBottom: 20, borderRadius: 20 }}
        />
        <div
          className="sk"
          style={{ height: 180, marginBottom: 20, borderRadius: 20 }}
        />
        <div className="sk" style={{ height: 52, borderRadius: 12 }} />
      </div>
    </div>
  );
}
