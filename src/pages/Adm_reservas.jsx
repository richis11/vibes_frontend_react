import { useState } from "react";
import { Button, Table, Badge } from "react-bootstrap";
import useReservas from "../hooks/useReservas";
import Modal_reservas from "../components/Modal_reservas";

function Adm_reservas() {
  const { reservas, loading, error, refetch } = useReservas();

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  const handleEditar = (reserva) => {
    setReservaSeleccionada(reserva);
    setModo("editar");
    setShowModal(true);
  };

  const handleNueva = () => {
    setReservaSeleccionada(null);
    setModo("crear");
    setShowModal(true);
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case "pendiente_pago":
        return <Badge bg="warning">Pendiente Pago</Badge>;
      case "pagada":
        return <Badge bg="info">Pagada</Badge>;
      case "confirmada":
        return <Badge bg="primary">Confirmada</Badge>;
      case "cancelada":
        return <Badge bg="danger">Cancelada</Badge>;
      case "completada":
        return <Badge bg="success">Completada</Badge>;
      case "reembolsada":
        return <Badge bg="dark">Reembolsada</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  if (loading) return <p className="mt-4">Cargando reservas...</p>;
  if (error) return <p className="text-danger mt-4">{error}</p>;

  return (
    <>
      <br />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Administración de Reservas</h2>
        <Button variant="primary" onClick={handleNueva}>
          Nueva Reserva
        </Button>
      </div>

      <Table striped bordered hover responsive className="text-start">
        <thead>
          <tr>
            <th>ID</th>
            <th>Casa ID</th>
            <th>Guest ID</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>
            <th>Noches</th>
            <th>Precio/Noche</th>
            <th>Subtotal</th>
            <th>Comisión</th>
            <th>Total</th>
            <th>Moneda</th>
            <th>Estado</th>
            <th>Stripe Payment</th>
            <th>Stripe Transfer</th>
            <th>Cancelada Por</th>
            <th>Motivo Cancelación</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Eliminado</th>
            <th>Opciones</th>
          </tr>
        </thead>

        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan="20" className="text-center text-muted">
                No hay reservas disponibles
              </td>
            </tr>
          ) : (
            reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.casa_id}</td>
                <td>{reserva.guest_id}</td>

                <td>
                  {reserva.fecha_inicio
                    ? new Date(reserva.fecha_inicio).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  {reserva.fecha_fin
                    ? new Date(reserva.fecha_fin).toLocaleDateString()
                    : "-"}
                </td>

                <td>{reserva.noches}</td>
                <td>{reserva.precio_por_noche}</td>
                <td>{reserva.subtotal}</td>
                <td>{reserva.comision_plataforma}</td>

                <td>
                  {reserva.total} {reserva.moneda}
                </td>

                <td>{reserva.moneda}</td>
                <td>{renderEstado(reserva.estado)}</td>

                <td>{reserva.stripe_payment_intent_id || "-"}</td>
                <td>{reserva.stripe_transfer_id || "-"}</td>
                <td>{reserva.cancelada_por || "-"}</td>
                <td>{reserva.motivo_cancelacion || "-"}</td>

                <td>
                  {reserva.created_at
                    ? new Date(reserva.created_at).toLocaleString()
                    : "-"}
                </td>

                <td>
                  {reserva.updated_at
                    ? new Date(reserva.updated_at).toLocaleString()
                    : "-"}
                </td>

                <td>
                  {reserva.deleted_at
                    ? new Date(reserva.deleted_at).toLocaleString()
                    : "-"}
                </td>

                <td>
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEditar(reserva)}
                  >
                    Editar
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      <Modal_reservas
        show={showModal}
        modo={modo}
        reserva={reservaSeleccionada}
        handleClose={() => setShowModal(false)}
        onSuccess={refetch}
      />
    </>
  );
}

export default Adm_reservas;
