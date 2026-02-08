import React from 'react'
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Form,
  Button,
  Nav,
  Navbar,
  NavbarBrand,
  Dropdown,
  NavDropdown,
  InputGroup,
  ButtonGroup,
  Container
} from "react-bootstrap";



function NavbarDesktop() {
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

            <Nav.Link as={Link} to="/adm_casas">
              Casas
            </Nav.Link>

            {/* <Button variant="outline-secondary" size="sm">
              Iniciar sesión
            </Button> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavbarDesktop