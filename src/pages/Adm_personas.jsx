import { useState } from "react";
import { Button, Table, Badge, Image } from "react-bootstrap";
import AdminPage from "../components/AdminPage";
import usePersonas from "../hooks/usePersonas";
import Modal_personas from "../components/Modal_personas";

function Adm_personas() {
  const { personas, loading, error, refetch } = usePersonas();

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [personaSeleccionada, setPersonaSeleccionada] = useState(null);

  const handleNuevo = () => {
    setPersonaSeleccionada(null);
    setModo("crear");
    setShowModal(true);
  };

  const handleEditar = (persona) => {
    setPersonaSeleccionada(persona);
    setModo("editar");
    setShowModal(true);
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case "activo":
        return <Badge bg="success">Activo</Badge>;
      case "suspendido":
        return <Badge bg="warning">Suspendido</Badge>;
      case "eliminado":
        return <Badge bg="danger">Eliminado</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };


  return (
    <>
      <AdminPage
        titulo="Clientes"
        subtitulo={`${personas.length} ${personas.length === 1 ? "persona" : "personas"}`}
        loading={loading}
        error={error}
        accion={<Button variant="primary" onClick={handleNuevo}>Nueva Persona</Button>}
      >

      <Table hover responsive className="text-start mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Cédula</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Fecha nacimiento</th>
            <th>Teléfono</th>
            <th>Dirección</th>
            <th>Foto</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Eliminado</th>
            <th>Opciones</th>
          </tr>
        </thead>

        <tbody>
          {personas.map((persona) => (
            <tr key={persona.id}>
              <td>{persona.id}</td>
              <td>{persona.user_id}</td>
              <td>{persona.cedula || "-"}</td>
              <td>{persona.nombres}</td>
              <td>{persona.apellidos}</td>
              <td>
                {new Date(persona.fecha_nacimiento).toISOString().split("T")[0]}
              </td>
              {/* <td>
                {new Date(persona.fecha_nacimiento).toLocaleDateString("es-EC")}
              </td> */}
              <td>{persona.telefono || "-"}</td>
              <td>{persona.direccion || "-"}</td>

              <td>
                {persona.foto_url ? (
                  <Image
                    src={persona.foto_url}
                    rounded
                    width={40}
                    height={40}
                  />
                ) : (
                  "-"
                )}
              </td>

              <td>{renderEstado(persona.estado)}</td>

              <td>
                {persona.created_at
                  ? new Date(persona.created_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {persona.updated_at
                  ? new Date(persona.updated_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {persona.deleted_at
                  ? new Date(persona.deleted_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleEditar(persona)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </AdminPage>

      <Modal_personas
        show={showModal}
        modo={modo}
        persona={personaSeleccionada}
        handleClose={() => setShowModal(false)}
        onSuccess={refetch}
      />
    </>
  );
}

export default Adm_personas;
