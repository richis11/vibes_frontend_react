import { Link, useNavigate } from "react-router-dom";
import { Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";

function NavbarDesktop() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const { isHost } = useAuth();

  const handleLogout = () => {
    logout();
    toast.info("Sesión cerrada");
    navigate("/login");
  };

  return (
    <Navbar bg="light" expand="lg" fixed="top" className="border-bottom">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-info">
          Vibes
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-lg-center gap-2">
            <Nav.Link as={Link} to="/">
              Inicio
            </Nav.Link>

            {/* Visible para todos los logueados */}
            <Nav.Link as={Link} to="/casas">
              Casas
            </Nav.Link>

            <Nav.Link as={Link} to="/mis_reservas">
              <i className="bi bi-calendar-check me-2" />
              Mis reservas
            </Nav.Link>

            {isHost && (
              <Nav.Link as={Link} to="/mi-panel">
                <i className="bi bi-house-gear me-2" />
                Mis propiedades
              </Nav.Link>
            )}

            {/* Solo admin */}
            {isAdmin && (
              <NavDropdown title="Administración" id="admin-dropdown">
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

            {/* Usuario logueado: avatar/nombre con dropdown */}
            {isLoggedIn ? (
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
            ) : (
              <Nav.Link
                as={Link}
                to="/login"
                className="btn btn-outline-info btn-sm px-3"
              >
                Iniciar sesión
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarDesktop;
