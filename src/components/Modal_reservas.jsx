import { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import reservasService from "../api/reservas_service";
import casasService from "../api/casas_service";
import personasService from "../api/personas_service";

function Modal_reservas({ show, modo, reserva, handleClose, onSuccess }) {
  const [casas, setCasas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  const initialState = {
    casa_id: "",
    guest_id: "",
    fecha_inicio: "",
    fecha_fin: "",
    noches: 0,
    precio_por_noche: 0,
    subtotal: 0,
    comision_plataforma: 0,
    total: 0,
    moneda: "USD",
    estado: "pendiente_pago",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // 🔥 Cargar casas y usuarios
  useEffect(() => {
    const fetchData = async () => {
      try {
        const casasData = await casasService.getCasas();
        const usuariosData = await personasService.getPersonas();
        setCasas(casasData);
        setUsuarios(usuariosData);
      } catch (error) {
        console.error("Error cargando datos:", error);
      }
    };

    if (show) fetchData();
  }, [show]);

  // 🔥 Modo editar
  useEffect(() => {
    if (modo === "editar" && reserva) {
      setForm({
        casa_id: reserva.casa_id ?? "",
        guest_id: reserva.guest_id ?? "",
        fecha_inicio: reserva.fecha_inicio?.split("T")[0] || "",
        fecha_fin: reserva.fecha_fin?.split("T")[0] || "",
        noches: reserva.noches ?? 0,
        precio_por_noche: reserva.precio_por_noche ?? 0,
        subtotal: reserva.subtotal ?? 0,
        comision_plataforma: reserva.comision_plataforma ?? 0,
        total: reserva.total ?? 0,
        moneda: reserva.moneda ?? "USD",
        estado: reserva.estado ?? "pendiente_pago",
      });
    } else {
      setForm(initialState);
    }
  }, [modo, reserva]);

  // 🔥 Cuando cambia casa → asignar precio automáticamente
  useEffect(() => {
    if (!form.casa_id) return;

    const casaSeleccionada = casas.find((c) => c.id === Number(form.casa_id));

    if (casaSeleccionada) {
      setForm((prev) => ({
        ...prev,
        precio_por_noche: Number(casaSeleccionada.precio), // 🔥 CORRECTO
      }));
    }
  }, [form.casa_id, casas]);

  // 🔥 Calcular noches y totales automáticamente
  useEffect(() => {
    if (!form.fecha_inicio || !form.fecha_fin) return;

    const inicio = new Date(form.fecha_inicio);
    const fin = new Date(form.fecha_fin);

    const diff = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));

    if (diff > 0) {
      const subtotal = diff * Number(form.precio_por_noche);
      const comision = subtotal * 0.1;
      const total = subtotal + comision;

      setForm((prev) => ({
        ...prev,
        noches: diff,
        subtotal,
        comision_plataforma: comision,
        total,
      }));
    }
  }, [form.fecha_inicio, form.fecha_fin, form.precio_por_noche]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = {
      casa_id: Number(form.casa_id),
      guest_id: Number(form.guest_id),
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      noches: Number(form.noches),
      precio_por_noche: Number(form.precio_por_noche),
      subtotal: Number(form.subtotal),
      comision_plataforma: Number(form.comision_plataforma),
      total: Number(form.total),
      moneda: form.moneda,
      estado: form.estado,
    };

    try {
      if (modo === "editar") {
        await reservasService.editarReserva(reserva.id, dataToSend);
      } else {
        await reservasService.crearReserva(dataToSend);
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar reserva");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "editar"
            ? `Editar Reserva #${reserva?.id}`
            : "Nueva Reserva"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* CASA */}
          <Form.Group className="mb-3">
            <Form.Label>Casa</Form.Label>
            <Form.Select
              name="casa_id"
              value={form.casa_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una casa</option>
              {casas.length === 0 && (
                <option disabled>No hay casas disponibles</option>
              )}
              {casas.map((casa) => (
                <option key={casa.id} value={casa.id}>
                  {casa.nombre} - ${casa.precio}/noche
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* CLIENTE */}
          <Form.Group className="mb-3">
            <Form.Label>Cliente</Form.Label>
            <Form.Select
              name="guest_id"
              value={form.guest_id}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione un cliente</option>
              {usuarios.length === 0 && (
                <option disabled>No hay usuarios disponibles</option>
              )}
              {usuarios.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.nombre} 
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Row>
            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Inicio</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_inicio"
                  value={form.fecha_inicio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group className="mb-3">
                <Form.Label>Fecha Fin</Form.Label>
                <Form.Control
                  type="date"
                  name="fecha_fin"
                  value={form.fecha_fin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <hr />

          <p>
            <strong>Noches:</strong> {form.noches}
          </p>
          <p>
            <strong>Precio por noche:</strong> ${form.precio_por_noche}
          </p>
          <p>
            <strong>Subtotal:</strong> ${Number(form.subtotal).toFixed(2)}
          </p>
          <p>
            <strong>Comisión (10%):</strong> $
            {Number(form.comision_plataforma).toFixed(2)}
          </p>
          <p>
            <strong>Total:</strong> ${Number(form.total).toFixed(2)}
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Guardando..." : "Guardar"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default Modal_reservas;
