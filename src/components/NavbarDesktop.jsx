import { Link, useNavigate } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLoginModal } from "../context/LoginModalContext";
import { useMode, MODES } from "../context/ModeContext";
import { toast } from "react-toastify";
import ModeToggle from "./ModeToggle";
import BotonHazteAnfitrion from "./BotonHazteAnfitrion";
import ModalConvierteAnfitrion from "./ModalConvierteteAnfitrion";

function NavbarDesktop() {
  const { user, isAdmin, isHost, isLoggedIn, logout } = useAuth();
  const { openLoginModal } = useLoginModal();
  const { isGuestMode, isHostMode } = useMode();
  const navigate = useNavigate();
  const [showModalAnfitrion, setShowModalAnfitrion] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada");
    navigate("/");
  };

  const handleOpenModalAnfitrion = () => {
    if (!isLoggedIn) {
      toast.info("Inicia sesión para convertirte en anfitrión");
      openLoginModal();
      return;
    }
    setShowModalAnfitrion(true);
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="border-bottom">
      <Container fluid style={{ maxWidth: 1400 }}>
        {/* Logo - Izquierda */}
        <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
          Vibes
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          {/* Opciones Centro */}
          <Nav className="mx-auto align-items-lg-center gap-3">
            {/* ========== CASAS (siempre visible) ========== */}
            <Nav.Link as={Link} to="/casas">
              Casas
            </Nav.Link>

            {/* ========== OPCIONES MODO CLIENTE (solo si está logueado) ========== */}
            {isLoggedIn && isGuestMode && (
              <Nav.Link as={Link} to="/mis_reservas">
                <i className="bi bi-calendar-check me-2" />
                Mis Reservas
              </Nav.Link>
            )}

            {/* ========== OPCIONES MODO ANFITRIÓN (solo si es host) ========== */}
            {isLoggedIn && isHostMode && isHost && (
              <>
                <Nav.Link as={Link} to="/mi-panel">
                  <i className="bi bi-house-gear me-2" />
                  Mis Propiedades
                </Nav.Link>
                <Nav.Link as={Link} to="/reservas-anfitrion">
                  <i className="bi bi-calendar-event me-2" />
                  Reservas Recibidas
                </Nav.Link>
              </>
            )}
          </Nav>

          {/* Opciones Derecha */}
          <Nav className="align-items-lg-center gap-2">
            {/* ========== TOGGLE DE MODO (solo si es host y está logueado) ========== */}
            {isLoggedIn && isHost && <ModeToggle />}

            {/* ========== BOTÓN HAZTE ANFITRIÓN (solo si NO es host y está logueado) ========== */}
            {isLoggedIn && !isHost && (
              <BotonHazteAnfitrion onOpenModal={handleOpenModalAnfitrion} />
            )}

            {/* ========== MENÚ ADMIN ========== */}
            {isLoggedIn && isAdmin && (
              <NavDropdown title="Admin" id="admin-dropdown">
                <NavDropdown.Item as={Link} to="/adm_users">
                  <i className="bi bi-people me-2" />
                  Users
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adm_clientes">
                  <i className="bi bi-person-lines-fill me-2" />
                  Clientes
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adm_hosts">
                  <i className="bi bi-house-heart me-2" />
                  Hosts
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/adm_casas">
                  <i className="bi bi-house-heart me-2" />
                  Casas
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/adm_reservas">
                  <i className="bi bi-calendar-check me-2" />
                  Reservas
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* ========== DROPDOWN DE USUARIO ========== */}
            {isLoggedIn && (
              <NavDropdown
                title={
                  <span>
                    <i className="bi bi-person-circle me-1" />
                    {user?.nombres ?? user?.email}
                    {isAdmin && (
                      <span
                        className="badge bg-info ms-2"
                        style={{ fontSize: 10 }}
                      >
                        Admin
                      </span>
                    )}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/perfil">
                  <i className="bi bi-person-badge me-2" />
                  Mi Perfil
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.ItemText
                  className="text-muted"
                  style={{ fontSize: 12 }}
                >
                  {user?.email}
                </NavDropdown.ItemText>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={handleLogout}
                  className="text-danger"
                >
                  <i className="bi bi-box-arrow-right me-2" />
                  Cerrar sesión
                </NavDropdown.Item>
              </NavDropdown>
            )}

            {/* ========== BOTÓN LOGIN ========== */}
            {!isLoggedIn && (
              <button
                onClick={() => openLoginModal()}
                className="btn btn-outline-info btn-sm px-3"
                style={{ border: "1.5px solid", cursor: "pointer" }}
              >
                Iniciar sesión
              </button>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      
      {/* Modal Conviértete en Anfitrión */}
      <ModalConvierteAnfitrion
        show={showModalAnfitrion}
        onClose={() => setShowModalAnfitrion(false)}
      />
    </Navbar>
  );
}

export default NavbarDesktop;