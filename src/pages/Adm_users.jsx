import { useState } from "react";
import { Button, Table, Badge } from "react-bootstrap";
import useUsers from "../hooks/useUsers";
import Modal_user from "../components/Modal_user";

function Adm_users() {
  const { users, loading, error, refetch } = useUsers();

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear"); // "crear" o "editar"
  const [userSeleccionado, setUserSeleccionado] = useState(null);

  const handleEditar = (user) => {
    setUserSeleccionado(user);
    setModo("editar");
    setShowModal(true);
  };

  const handleNuevo = () => {
    setUserSeleccionado(null);
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

  if (loading) return <p className="mt-4">Cargando usuarios...</p>;
  if (error) return <p className="text-danger mt-4">{error}</p>;

  return (
    <>
      <br />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Administración de Usuarios</h2>
        <Button variant="primary" onClick={handleNuevo}>
          Nuevo Usuario
        </Button>
      </div>

      <Table striped bordered hover responsive className="text-start">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Admin</th>
            <th>Stripe ID</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Eliminado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>

              <td>
                {user.is_admin ? (
                  <Badge bg="dark">Admin</Badge>
                ) : (
                  <Badge bg="secondary">Usuario</Badge>
                )}
              </td>

              <td>{user.stripe_customer_id || "-"}</td>

              <td>{renderEstado(user.estado)}</td>

              <td>
                {user.created_at
                  ? new Date(user.created_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {user.updated_at
                  ? new Date(user.updated_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {user.deleted_at
                  ? new Date(user.deleted_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => handleEditar(user)}
                >
                  Editar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal User */}
      <Modal_user
        show={showModal}
        modo={modo}
        user={userSeleccionado}
        handleClose={() => setShowModal(false)}
        onSuccess={refetch}
      />
    </>
  );
}

export default Adm_users;
