import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import personasService from "../api/personas_service";
import useUsersDisponibles from "../hooks/useUsersDisponibles";

function Modal_persona({ show, handleClose, modo, persona, onSuccess }) {
  const { usersDisponibles, loading, error, refetch } = useUsersDisponibles();

  const [form, setForm] = useState({
    user_id: "",
    cedula: "",
    nombres: "",
    apellidos: "",
    fecha_nacimiento: "",
    telefono: "",
    direccion: "",
    foto_url: "",
    estado: "activo",
  });

  useEffect(() => {
    if (show && modo === "crear") {
      refetch();
    }
  }, [show, modo]);

  useEffect(() => {
    if (modo === "editar" && persona) {
      setForm({
        user_id: persona.user_id || "",
        cedula: persona.cedula || "",
        nombres: persona.nombres || "",
        apellidos: persona.apellidos || "",
        fecha_nacimiento: persona.fecha_nacimiento
          ? new Date(persona.fecha_nacimiento).toISOString().split("T")[0]
          : "",
        telefono: persona.telefono || "",
        direccion: persona.direccion || "",
        foto_url: persona.foto_url || "",
        estado: persona.estado || "activo",
      });
    } else {
      setForm({
        user_id: "",
        cedula: "",
        nombres: "",
        apellidos: "",
        fecha_nacimiento: "",
        telefono: "",
        direccion: "",
        foto_url: "",
        estado: "activo",
      });
    }
  }, [modo, persona]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (modo === "crear") {
        await personasService.crearPersona(form);
      } else {
        await personasService.editarPersona(persona.id, form);
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error guardando persona", err);
    }
  };

  if (loading && modo === "crear")
    return <p className="mt-4">Cargando usuarios...</p>;

  if (error) return <p className="text-danger mt-4">{error}</p>;

  return (
    <Modal show={show} onHide={handleClose} centered className="adm-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "crear" ? "Nueva Persona" : "Editar Persona"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {modo === "crear" && (
            <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Select
                name="user_id"
                value={form.user_id}
                onChange={handleChange}
                required
                disabled={!usersDisponibles || usersDisponibles.length === 0}
              >
                {loading ? (
                  <option>Cargando usuarios...</option>
                ) : usersDisponibles && usersDisponibles.length > 0 ? (
                  <>
                    <option value="">Seleccione un usuario</option>
                    {usersDisponibles.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} - {user.email}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No hay usuarios disponibles</option>
                )}
              </Form.Select>
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Cédula</Form.Label>
            <Form.Control
              type="text"
              name="cedula"
              value={form.cedula}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nombres</Form.Label>
            <Form.Control
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Fecha de Nacimiento</Form.Label>
            <Form.Control
              type="date"
              name="fecha_nacimiento"
              value={form.fecha_nacimiento}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Foto URL</Form.Label>
            <Form.Control
              type="text"
              name="foto_url"
              value={form.foto_url}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Estado</Form.Label>
            <Form.Select
              name="estado"
              value={form.estado}
              onChange={handleChange}
            >
              <option value="activo">Activo</option>
              <option value="eliminado">Eliminado</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modal_persona;