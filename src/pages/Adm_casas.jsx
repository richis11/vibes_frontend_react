import { useState } from "react";
import { Button, Table, Badge } from "react-bootstrap";
import AdminPage from "../components/AdminPage";
import useCasas from "../hooks/useCasas";
import Modal_casas from "../components/Modal_casas";
import Modal_imagenes from "../components/Modal_imagenes";

function Adm_casas() {
  const { casas, loading, error, refetch } = useCasas();

  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [casaSeleccionada, setCasaSeleccionada] = useState(null);

  const [showImagenes, setShowImagenes] = useState(false);
  const [casaImagenes, setCasaImagenes] = useState(null);

  const handleEditar = (casa) => {
    setCasaSeleccionada(casa);
    setModo("editar");
    setShowModal(true);
  };

  const handleNuevo = () => {
    setCasaSeleccionada(null);
    setModo("crear");
    setShowModal(true);
  };

  const handleImagenes = (casa) => {
    setCasaImagenes(casa);
    setShowImagenes(true);
  };

  const renderEstado = (estado) => {
    switch (estado) {
      case "activa":
        return <Badge bg="success">Activa</Badge>;
      case "inactiva":
        return <Badge bg="secondary">Inactiva</Badge>;
      case "suspendida":
        return <Badge bg="warning">Suspendida</Badge>;
      case "eliminada":
        return <Badge bg="danger">Eliminada</Badge>;
      default:
        return <Badge bg="dark">{estado}</Badge>;
    }
  };


  return (
    <>
      <AdminPage
        titulo="Casas"
        subtitulo={`${casas.length} ${casas.length === 1 ? "casa" : "casas"}`}
        loading={loading}
        error={error}
        accion={<Button variant="primary" onClick={handleNuevo}>Nueva Casa</Button>}
      >

      <Table hover responsive className="text-start mb-0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Host ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Dirección</th>
            <th>Precio</th>
            <th>Disponibilidad</th>
            <th>Estado</th>
            <th>Creado</th>
            <th>Actualizado</th>
            <th>Eliminado</th>
            <th>Opciones</th>
          </tr>
        </thead>

        <tbody>
          {casas.map((casa) => (
            <tr key={casa.id}>
              <td>{casa.id}</td>

              <td>{casa.host_id}</td>

              <td>{casa.nombre}</td>

              <td>
                {casa.descripcion
                  ? casa.descripcion.substring(0, 40) + "..."
                  : "-"}
              </td>

              <td>{casa.direccion}</td>

              <td>${parseFloat(casa.precio).toFixed(2)}</td>

              <td>
                <Badge bg="info">{casa.disponibilidad}</Badge>
              </td>

              <td>{renderEstado(casa.estado)}</td>

              <td>
                {casa.created_at
                  ? new Date(casa.created_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {casa.updated_at
                  ? new Date(casa.updated_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                {casa.deleted_at
                  ? new Date(casa.deleted_at).toLocaleString()
                  : "-"}
              </td>

              <td>
                <Button
                  size="sm"
                  variant="outline-primary"
                  onClick={() => handleEditar(casa)}
                >
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="outline-primary"
                  className="ms-1"
                  onClick={() => handleImagenes(casa)}
                  title="Gestionar imágenes"
                >
                  <i className="bi bi-images" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      </AdminPage>

      <Modal_casas
        show={showModal}
        modo={modo}
        casa={casaSeleccionada}
        handleClose={() => setShowModal(false)}
        onSuccess={refetch}
      />

      <Modal_imagenes
        show={showImagenes}
        onClose={() => {
          setShowImagenes(false);
          setCasaImagenes(null);
        }}
        casa={casaImagenes}
      />
    </>
  );
}

export default Adm_casas;
