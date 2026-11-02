// src/utils/mensajeError.js
// El backend devuelve `message` como string o, en errores de validación, como array
export function mensajeError(err, porDefecto = "Ocurrió un error") {
  const message = err?.response?.data?.message;
  if (Array.isArray(message)) return message.join(". ");
  return message || porDefecto;
}
