import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import casas_service from "../api/casas_service";

function Modal_casa({ show, modo, casa, handleClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    precio: 0,
    estado: "",
  });

  const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (modo === "editar" && casa) {
        setForm({
          nombre: casa.nombre || "",
          descripcion: casa.descripcion || "",
          direccion: casa.direccion || "",
          precio: casa.precio || "",
          estado: casa.estado || "",
        });
      } else {
        setForm({
          nombre: "",
          descripcion: "",
          direccion: "",
          precio: 0,
          estado: "",
        });
      }
    }, [modo, casa]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  // METODOS DEL CASA SERVICE
  const crearCasa = async (casa) => {
    await casas_service.crearCasa(casa);
  };
  const editarCasa = async (id, casa) => {
    await casas_service.editarCasa(id, casa);
  };

  //________________________________________
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modo === "editar") {
        await editarCasa(casa.id, form);
      } else {
        await crearCasa(form);
      }
      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "editar" ? "Editar "+`${form.nombre}` : "Nueva casa"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={form.nombre || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="descripcion"
              value={form.descripcion || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Direccion</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={form.direccion || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="text"
              name="precio"
              value={form.precio || 0}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="text"
              name="estado"
              value={form.estado || ""}
              onChange={handleChange}
              required
            />
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

export default Modal_casa;
