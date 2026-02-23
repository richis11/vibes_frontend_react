import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import casaImagenesService from "../api/casa_imagenes_service";

const IMAGEN_GENERICA =
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&q=80";

export default function Modal_imagenes({ show, onClose, casa }) {
  const [imagenes, setImagenes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subiendo, setSubiendo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef();

  // ── Cargar imágenes al abrir ──────────────────────────────────────────
  useEffect(() => {
    if (show && casa?.id) fetchImagenes();
  }, [show, casa]);

  const fetchImagenes = async () => {
    setLoading(true);
    try {
      const data = await casaImagenesService.getImagenesPorCasa(casa.id);
      setImagenes(data);
    } catch {
      toast.error("Error al cargar imágenes");
    } finally {
      setLoading(false);
    }
  };

  // ── Subir archivos ────────────────────────────────────────────────────
  const handleFiles = async (files) => {
    const validos = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!validos.length) return toast.error("Solo se permiten imágenes");
    if (validos.some((f) => f.size > 5 * 1024 * 1024))
      return toast.error("Máximo 5MB por imagen");

    setSubiendo(true);
    try {
      for (const file of validos) {
        const esPrincipal = imagenes.length === 0; // primera imagen → principal
        await casaImagenesService.subirImagen(casa.id, file, esPrincipal);
      }
      toast.success(
        validos.length === 1 ? "Imagen subida" : `${validos.length} imágenes subidas`
      );
      fetchImagenes();
    } catch {
      toast.error("Error al subir imagen");
    } finally {
      setSubiendo(false);
    }
  };

  const handleEliminar = async (imagenId) => {
    if (!window.confirm("¿Eliminar esta imagen?")) return;
    try {
      await casaImagenesService.eliminarImagen(imagenId);
      toast.success("Imagen eliminada");
      fetchImagenes();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const handleMarcarPrincipal = async (imagenId) => {
    try {
      await casaImagenesService.marcarPrincipal(casa.id, imagenId);
      toast.success("Imagen principal actualizada");
      fetchImagenes();
    } catch {
      toast.error("Error al actualizar");
    }
  };

  if (!show) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 1050,
          background: "rgba(0,20,40,0.55)", backdropFilter: "blur(5px)",
        }}
      />

      {/* Modal */}
      <div
        style={{
          position: "fixed", inset: 0, zIndex: 1060,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20, pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%", maxWidth: 680, background: "#fff",
            borderRadius: 20, pointerEvents: "all",
            boxShadow: "0 24px 80px rgba(0,140,200,0.28)",
            fontFamily: "'DM Sans', sans-serif",
            maxHeight: "90vh", display: "flex", flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 24px 16px",
              borderBottom: "1px solid rgba(0,180,230,0.12)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 18,
                  fontWeight: 800, color: "#002d44", margin: 0,
                }}
              >
                📷 Imágenes de la casa
              </h2>
              <p style={{ fontSize: 12, color: "#5aabb8", margin: "2px 0 0" }}>
                {casa?.nombre} · {imagenes.length} imagen{imagenes.length !== 1 ? "es" : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(0,180,230,0.08)", border: "none",
                borderRadius: 8, width: 32, height: 32, cursor: "pointer",
                fontSize: 16, color: "#007aaa", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div style={{ overflowY: "auto", padding: 24, flex: 1 }}>

            {/* Zona de drop */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleFiles(e.dataTransfer.files);
              }}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${dragOver ? "#00b4e6" : "rgba(0,180,230,0.3)"}`,
                borderRadius: 14,
                padding: "28px 20px",
                textAlign: "center",
                cursor: subiendo ? "not-allowed" : "pointer",
                background: dragOver ? "rgba(0,180,230,0.06)" : "rgba(0,180,230,0.02)",
                transition: "all 0.2s",
                marginBottom: 24,
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
                disabled={subiendo}
              />
              {subiendo ? (
                <div style={{ color: "#00b4e6", fontWeight: 600, fontSize: 14 }}>
                  ⏳ Subiendo imágenes...
                </div>
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>🖼️</div>
                  <div style={{ fontWeight: 700, color: "#003a56", fontSize: 14 }}>
                    Arrastra imágenes aquí o haz clic para seleccionar
                  </div>
                  <div style={{ fontSize: 12, color: "#5aabb8", marginTop: 4 }}>
                    PNG, JPG, WEBP · Máx. 5MB por imagen · Múltiples archivos
                  </div>
                </>
              )}
            </div>

            {/* Grid de imágenes */}
            {loading ? (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#5aabb8" }}>
                Cargando imágenes...
              </div>
            ) : imagenes.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "#5aabb8", fontSize: 14 }}>
                Aún no hay imágenes para esta casa
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 14,
                }}
              >
                {imagenes.map((img) => (
                  <ImagenCard
                    key={img.id}
                    imagen={img}
                    casaId={casa.id}
                    onEliminar={handleEliminar}
                    onMarcarPrincipal={handleMarcarPrincipal}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Tarjeta de imagen ──────────────────────────────────────────────────────
function ImagenCard({ imagen, onEliminar, onMarcarPrincipal }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 12,
        overflow: "hidden",
        border: imagen.es_principal
          ? "2.5px solid #00b4e6"
          : "1.5px solid rgba(0,180,230,0.15)",
        boxShadow: hovered
          ? "0 8px 28px rgba(0,140,200,0.2)"
          : "0 2px 8px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.2s ease",
        position: "relative",
        background: "#e8f6ff",
      }}
    >
      {/* Badge principal */}
      {imagen.es_principal && (
        <div
          style={{
            position: "absolute", top: 8, left: 8, zIndex: 2,
            background: "#00b4e6", color: "#fff",
            fontSize: 10, fontWeight: 700, padding: "3px 8px",
            borderRadius: 99, letterSpacing: "0.05em",
          }}
        >
          ⭐ Principal
        </div>
      )}

      {/* Imagen */}
      <img
        src={imgError ? IMAGEN_GENERICA : imagen.url}
        alt=""
        onError={() => setImgError(true)}
        style={{ width: "100%", height: 140, objectFit: "cover", display: "block" }}
      />

      {/* Acciones — aparecen al hover */}
      <div
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,20,40,0.5)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 8,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {!imagen.es_principal && (
          <button
            onClick={() => onMarcarPrincipal(imagen.id)}
            style={btnStyle("#00b4e6")}
          >
            ⭐ Hacer principal
          </button>
        )}
        <button
          onClick={() => onEliminar(imagen.id)}
          style={btnStyle("#ef4444")}
        >
          🗑 Eliminar
        </button>
      </div>

      {/* Orden badge */}
      <div
        style={{
          padding: "6px 10px",
          fontSize: 11, color: "#5aabb8",
          background: "#fff",
        }}
      >
        Orden: {imagen.orden}
      </div>
    </div>
  );
}

const btnStyle = (color) => ({
  background: color, color: "#fff",
  border: "none", borderRadius: 8,
  padding: "7px 14px", fontSize: 12,
  fontWeight: 700, cursor: "pointer",
  fontFamily: "inherit", width: "80%",
});