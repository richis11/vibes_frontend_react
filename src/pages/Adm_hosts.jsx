import { useState } from "react";
import { Button, Table, Badge } from "react-bootstrap";
import AdminPage from "../components/AdminPage";
import useHosts from "../hooks/useHosts";
import Modal_hosts from "../components/Modal_hosts";

function Adm_hosts() {
  const { hosts, loading, error, refetch } = useHosts();

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [hostSeleccionado, setHostSeleccionado] = useState(null);

  const handleEditar = (host) => {
    setHostSeleccionado(host);
    setModo("editar");
    setShowModal(true);
  };

  const handleNuevo = () => {
    setHostSeleccionado(null);
    setModo("crear");
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
        titulo="Anfitriones"
        subtitulo={`${hosts.length} ${hosts.length === 1 ? "anfitrión" : "anfitriones"}`}
        loading={loading}
        error={error}
        accion={<Button variant="primary" onClick={handleNuevo}>Nuevo Host</Button>}
      >

      <Table hover responsive className="text-start mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Persona ID</th>
            <th>Verificado</th>
            <th>Rating</th>
            <th>Estado</th>
            <th>Stripe Account</th>
            <th>Onboarding</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Eliminado</th>
            <th>Opciones</th>
          </tr>
        </thead>

        <tbody>
          {hosts.map((host) => (
            <tr key={host.id}>
              <td>{host.id}</td>

              <td>{host.persona_id}</td>

              <td>
                {host.verificado ? (
                  <Badge bg="success">Sí</Badge>
                ) : (
                  <Badge bg="secondary">No</Badge>
                )}
              </td>

              <td>{host.rating}</td>

              <td>{renderEstado(host.estado)}</td>

              <td>{host.stripe_account_id || "-"}</td>

              <td>
                {host.stripe_onboarding_completed ? (
                  <Badge bg="success">Completado</Badge>
                ) : (
                  <Badge bg="warning">Pendiente</Badge>
                )}
              </td>

              <td>
                {host.created_at
                  ? new Date(host.created_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {host.updated_at
                  ? new Date(host.updated_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {host.deleted_at
                  ? new Date(host.deleted_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleEditar(host)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </AdminPage>

      <Modal_hosts
        show={showModal}
        modo={modo}
        host={hostSeleccionado}
        handleClose={() => setShowModal(false)}
        onSuccess={refetch}
      />
    </>
  );
}

export default Adm_hosts;
