import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import casasService from "../api/casas_service";
import useHosts from "../hooks/useHosts";

function Modal_casas({ show, modo, casa, handleClose, onSuccess }) {
  const { hosts } = useHosts(); // para seleccionar host

  const initialState = {
    host_id: "",
    nombre: "",
    descripcion: "",
    direccion: "",
    precio: "",
    disponibilidad: "disponible",
    estado: "activa",
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Llenar formulario en editar
  useEffect(() => {
    if (modo === "editar" && casa) {
      setForm({
        host_id: casa.host_id || "",
        nombre: casa.nombre || "",
        descripcion: casa.descripcion || "",
        direccion: casa.direccion || "",
        precio: casa.precio || "",
        disponibilidad: casa.disponibilidad || "disponible",
        estado: casa.estado || "activa",
      });
    } else {
      setForm(initialState);
    }
  }, [modo, casa]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "precio" ? parseFloat(value) || "" : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modo === "editar") {
        await casasService.editarCasa(casa.id, form);
      } else {
        await casasService.crearCasa(form);
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar casa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="adm-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "editar"
            ? `Editar ${casa?.nombre}`
            : "Nueva Casa"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>

          {/* Host */}
          <Form.Group className="mb-3">
            <Form.Label>Host</Form.Label>
            <Form.Select
              name="host_id"
              value={form.host_id}
              onChange={handleChange}
              required
              disabled={modo === "editar"} // no cambiar host al editar
            >
              <option value="">Seleccione un host</option>
              {hosts?.map((host) => (
                <option key={host.id} value={host.id}>
                  Host #{host.id}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {/* Nombre */}
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Descripción */}
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Dirección */}
          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Precio */}
          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {/* Disponibilidad */}
          <Form.Group className="mb-3">
            <Form.Label>Disponibilidad</Form.Label>
            <Form.Select
              name="disponibilidad"
              value={form.disponibilidad}
              onChange={handleChange}
            >
              <option value="disponible">Disponible</option>
              <option value="ocupada">Ocupada</option>
              <option value="mantenimiento">Mantenimiento</option>
            </Form.Select>
          </Form.Group>

          {/* Estado */}
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
              <option value="suspendida">Suspendida</option>
              <option value="eliminada">Eliminada</option>
            </Form.Select>
          </Form.Group>

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

export default Modal_casas;
