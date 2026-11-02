import { useState, useEffect } from "react";
import { Button, Table, Badge, ButtonGroup } from "react-bootstrap";
import { toast } from "react-toastify";
import pagosService from "../api/pagos_service";
import { mensajeError } from "../utils/mensajeError";
import AdminPage from "../components/AdminPage";

const FILTROS = [
  { key: "en_revision", label: "En revisión" },
  { key: "aprobado", label: "Aprobados" },
  { key: "rechazado", label: "Rechazados" },
  { key: "", label: "Todos" },
];

function Adm_pagos() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("en_revision");
  const [procesando, setProcesando] = useState(null);

  const cargar = () => {
    setLoading(true);
    pagosService
      .getPagos(filtro)
      .then(setPagos)
      .catch((err) => toast.error(mensajeError(err, "Error al cargar pagos")))
      .finally(() => setLoading(false));
  };

  useEffect(cargar, [filtro]);

  const aprobar = async (pago) => {
    if (!window.confirm(`¿Confirmas que recibiste $${pago.monto} ${pago.moneda} de la reserva #${pago.reserva_id}?`)) return;
    setProcesando(pago.id);
    try {
      const data = await pagosService.aprobarPago(pago.id);
      toast.success(data.message);
      cargar();
    } catch (err) {
      toast.error(mensajeError(err, "No se pudo aprobar"));
    } finally {
      setProcesando(null);
    }
  };

  const rechazar = async (pago) => {
    const motivo = window.prompt(
      "Motivo del rechazo (lo verá el huésped):",
      "No encontramos la transferencia en la cuenta",
    );
    if (!motivo?.trim()) return;
    setProcesando(pago.id);
    try {
      const data = await pagosService.rechazarPago(pago.id, motivo);
      toast.success(data.message);
      cargar();
    } catch (err) {
      toast.error(mensajeError(err, "No se pudo rechazar"));
    } finally {
      setProcesando(null);
    }
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case "en_revision":
        return <Badge bg="warning">En revisión</Badge>;
      case "aprobado":
        return <Badge bg="success">Aprobado</Badge>;
      case "rechazado":
        return <Badge bg="danger">Rechazado</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  return (
    <AdminPage
      titulo="Pagos por transferencia"
      subtitulo={`${pagos.length} ${pagos.length === 1 ? "pago" : "pagos"}`}
      loading={loading}
      accion={
        <ButtonGroup>
          {FILTROS.map((f) => (
            <Button
              key={f.key}
              variant={filtro === f.key ? "primary" : "outline-primary"}
              onClick={() => setFiltro(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </ButtonGroup>
      }
    >
        <Table hover responsive className="text-start mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Reserva</th>
              <th>Casa</th>
              <th>Fechas</th>
              <th>Monto</th>
              <th>Referencia</th>
              <th>Comprobante</th>
              <th>Estado</th>
              <th>Enviado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {pagos.length === 0 ? (
              <tr>
                <td colSpan="10" className="adm-vacio">
                  No hay pagos {FILTROS.find((f) => f.key === filtro)?.label.toLowerCase()}
                </td>
              </tr>
            ) : (
              pagos.map((pago) => (
                <tr key={pago.id}>
                  <td>{pago.id}</td>
                  <td>
                    #{pago.reserva_id}
                    <div className="small text-muted">{pago.reserva_estado}</div>
                  </td>
                  <td>{pago.casa_nombre}</td>
                  <td className="small">
                    {pago.fecha_inicio} → {pago.fecha_fin}
                  </td>
                  <td>
                    <b>${pago.monto}</b> {pago.moneda}
                  </td>
                  <td>{pago.referencia || "-"}</td>
                  <td>
                    {pago.comprobante_url ? (
                      <a href={pago.comprobante_url} target="_blank" rel="noreferrer">
                        <img
                          src={pago.comprobante_url}
                          alt="Comprobante"
                          style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 6 }}
                        />
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                    {renderEstado(pago.estado)}
                    {pago.motivo_rechazo && (
                      <div className="small text-muted">{pago.motivo_rechazo}</div>
                    )}
                  </td>
                  <td className="small">
                    {pago.created_at ? new Date(pago.created_at).toLocaleString() : "-"}
                  </td>
                  <td>
                    {pago.estado === "en_revision" && (
                      <div className="d-flex gap-1">
                        <Button
                          size="sm"
                          variant="success"
                          disabled={procesando === pago.id}
                          onClick={() => aprobar(pago)}
                        >
                          Aprobar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          disabled={procesando === pago.id}
                          onClick={() => rechazar(pago)}
                        >
                          Rechazar
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
    </AdminPage>
  );
}

export default Adm_pagos;
