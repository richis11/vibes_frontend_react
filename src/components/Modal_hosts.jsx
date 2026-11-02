import { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import hostsService from "../api/hosts_service";
import usePersonasDisponibles from "../hooks/usePersonasDisponibles";

function Modal_host({ show, handleClose, modo, host, onSuccess }) {
  const { personasDisponibles, loading, error, refetch } =
    usePersonasDisponibles();

  const [form, setForm] = useState({
    persona_id: "",
    verificado: false,
    rating: 0,
    estado: "activo",
    stripe_account_id: "",
    stripe_onboarding_completed: false,
  });

  // 🔥 Refrescar personas al abrir en modo crear
  useEffect(() => {
    if (show && modo === "crear") {
      refetch();
    }
  }, [show, modo]);

  useEffect(() => {
    if (modo === "editar" && host) {
      setForm({
        persona_id: host.persona_id || "",
        verificado: host.verificado || false,
        rating: host.rating || 0,
        estado: host.estado || "activo",
        stripe_account_id: host.stripe_account_id || "",
        stripe_onboarding_completed: host.stripe_onboarding_completed || false,
      });
    } else {
      setForm({
        persona_id: "",
        verificado: false,
        rating: 0,
        estado: "activo",
        stripe_account_id: "",
        stripe_onboarding_completed: false,
      });
    }
  }, [modo, host]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "rating"
            ? parseFloat(value)
            : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (form.stripe_account_id == "") {
        form.stripe_account_id = null;
      }
      if (modo === "crear") {
        await hostsService.crearHost(form);
      } else {
        await hostsService.editarHost(host.id, form);
      }

      onSuccess();
      handleClose();
    } catch (err) {
      console.error("Error guardando host", err);
    }
  };

  if (loading && modo === "crear")
    return <p className="mt-4">Cargando personas...</p>;

  if (error) return <p className="text-danger mt-4">{error}</p>;

  return (
    <Modal show={show} onHide={handleClose} centered className="adm-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          {modo === "crear" ? "Nuevo Host" : "Editar Host"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          {/* 🔥 SELECT PERSONA (solo crear) */}
          {modo === "crear" && (
            <Form.Group className="mb-3">
              <Form.Label>Persona</Form.Label>

              <Form.Select
                name="persona_id"
                value={form.persona_id}
                onChange={handleChange}
                required
                disabled={
                  !personasDisponibles || personasDisponibles.length === 0
                }
              >
                {personasDisponibles && personasDisponibles.length > 0 ? (
                  <>
                    <option value="">Seleccione una persona</option>

                    {personasDisponibles.map((persona) => (
                      <option key={persona.id} value={persona.id}>
                        {persona.nombres} - {persona.apellidos}
                      </option>
                    ))}
                  </>
                ) : (
                  <option value="">No hay personas disponibles</option>
                )}
              </Form.Select>
            </Form.Group>
          )}

          {/* Verificado */}
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Verificado"
              name="verificado"
              checked={form.verificado}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Rating */}
          <Form.Group className="mb-3">
            <Form.Label>Rating</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              max="5"
              name="rating"
              value={form.rating}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Estado */}
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

          {/* Stripe Account */}
          <Form.Group className="mb-3">
            <Form.Label>Stripe Account ID</Form.Label>
            <Form.Control
              type="text"
              name="stripe_account_id"
              value={form.stripe_account_id}
              onChange={handleChange}
            />
          </Form.Group>

          {/* Stripe Onboarding */}
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Stripe Onboarding Completado"
              name="stripe_onboarding_completed"
              checked={form.stripe_onboarding_completed}
              onChange={handleChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancelar
        </Button>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={
            modo === "crear" &&
            (!personasDisponibles || personasDisponibles.length === 0)
          }
        >
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default Modal_host;
