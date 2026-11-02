import "../styles/admin.css";

// Marco común de las páginas de administración: márgenes, cabecera y
// tarjeta blanca para la tabla. `accion` va a la derecha del título.
export default function AdminPage({ titulo, subtitulo, accion, loading, error, children }) {
  return (
    <div className="adm">
      <div className="adm-contenedor">
        <div className="adm-header">
          <div>
            <span className="adm-eyebrow">Panel de administración</span>
            <h1 className="adm-titulo">{titulo}</h1>
            {subtitulo && !loading && !error && (
              <p className="adm-subtitulo">{subtitulo}</p>
            )}
          </div>
          {accion}
        </div>

        <div className="adm-card">
          {loading ? (
            <div className="adm-estado">
              <div className="adm-spinner" />
              Cargando…
            </div>
          ) : error ? (
            <div className="adm-estado error">{error}</div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}

// Fila de "no hay datos" para el <tbody>
export function FilaVacia({ columnas, children = "No hay registros" }) {
  return (
    <tr>
      <td colSpan={columnas} className="adm-vacio">
        {children}
      </td>
    </tr>
  );
}
