import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import usersService from "../api/users_service";
import { mensajeError } from "../utils/mensajeError";

function Modal_user({ show, modo, user, handleClose, onSuccess }) {
  const initialState = {
    email: "",
    password_hash: "",
    is_admin: false,
    estado: "activo",
    stripe_customer_id: null,
  };

  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);

  // Llenar formulario en editar
  useEffect(() => {
    if (modo === "editar" && user) {
      setForm({
        email: user.email || "",
        password_hash: "", // no mostramos password
        is_admin: user.is_admin || false,
        estado: user.estado || "activo",
        stripe_customer_id: user.stripe_customer_id || null,
      });
    } else {
      setForm(initialState);
    }
  }, [modo, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (modo === "editar") {
        await usersService.editarUser(user.id, {
          email: form.email,
          is_admin: form.is_admin,
          estado: form.estado,
          stripe_customer_id: form.stripe_customer_id || null,
        });
      } else {
        await usersService.crearUser(form); // password incluido al crear
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error(err);
      alert(mensajeError(err, "Error al guardar usuario"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "editar" ? `Editar ${user?.email}` : "Nuevo usuario"}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              disabled={modo === "editar"} // no permitir cambiar email en edición
            />
          </Form.Group>

          {modo === "crear" && (
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password_hash"
                value={form.password_hash}
                onChange={handleChange}
                required
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Administrador"
              name="is_admin"
              checked={form.is_admin}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="activo">Activo</option>
              <option value="suspendido">Suspendido</option>
              <option value="eliminado">Eliminado</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Stripe Customer ID</Form.Label>
            <Form.Control
              type="text"
              name="stripe_customer_id"
              value={form.stripe_customer_id}
              onChange={handleChange}
              placeholder="Opcional"
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

export default Modal_user;
