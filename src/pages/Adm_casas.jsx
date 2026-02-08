import { react, useState, useEffect } from "react";
import casas_service from "../api/casas_service";
import {Button, Table, Row, Col, Modal, Form} from "react-bootstrap";
//import {Table, Spinner, Alert} from "react-bootstrap";
import Modal_casa from "../components/Modal_casas";

function Adm_casas() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modo, setModo] = useState("crear");
  const [casaSeleccionada, setCasaSeleccionada] = useState(null);

  const [casas, SetCasas] = useState([]);
  const [casa, SetCasa] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    precio: 0,
    estado: "",
  });

const cargarCasas = async () => {
  try {
    const res = await getCasas();
    if (res?.data) {
      SetCasas(res.data);
    }
  } catch (err) {
    console.error(err);
  }
};

  useEffect(() => {
    console.log("useEffect - cargando casas");
    getCasas()
      .then((res) => {
        SetCasas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error al cargar las casas");
        setLoading(false);
      });
  }, []);

  const handleEditar = (casa) => {
    setCasaSeleccionada(casa);
    setModo("editar");
    setShowModal(true);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta casa?")) return;

    await eliminarCasa(id);
    cargarCasas();
  };

  // if (loading) {
  //   return (
  //     <div className="text-center mt-5">
  //       <Spinner animation="border" />
  //     </div>
  //   );
  // }

//   if (error) {
//     return (
//       <Alert variant="danger" className="mt-4">
//         {error}
//       </Alert>
//     );
//   }

  //____________________________ LLAMAR A CASAS SERVICES
  const getCasas = async () => {
    let lista_casas = await casas_service.getCasas();
    SetCasas(lista_casas.reverse());
  };

  //   const getCasa = async (id) => {
  //     SetCasa(await casas_service.getCasa(id));
  //   };

  //   const crearCasa = async (casa) => {
  //     await casas_service.crearCasa(casa);
  //   };

    // const editarCasa = async (id, casa) => {
    //   await casas_service.editarCasa(id, casa);
    // };

    const eliminarCasa = async (id) => {
      await casas_service.eliminarCasa(id);
    };
  //____________________________________________________________RETURN
  return (
    <div className="p-4">
      <div className="d-flex justify-content-between">
        <h2 className="mb-4">Casas disponibles</h2>
        <div>
          <Button onClick={() => setShowModal(true)}>Nueva</Button>
        </div>
      </div>

      <Table striped bordered hover responsive className="text-start">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Dirección</th>
            <th>Precio</th>
            <th>Estado</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {casas.map((casa, index) => (
            <tr key={casa.id}>
              <td>{casa.id}</td>
              <td>{casa.nombre}</td>
              <td>{casa.descripcion}</td>
              <td>{casa.direccion}</td>
              <td>${casa.precio}</td>
              <td>{casa.estado}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    size="sm"
                    variant="warning"
                    onClick={() => handleEditar(casa)}
                  >
                    <i className="bi bi-pencil"></i>
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => handleEliminar(casa.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </div>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal_casa
        show={showModal}
        handleClose={() => setShowModal(false)}
        modo={modo}
        casa={casaSeleccionada}
        onSuccess={cargarCasas}
      />
    </div>
  )
}

export default Adm_casas;
