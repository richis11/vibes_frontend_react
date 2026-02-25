// src/App.jsx
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import NavbarDesktop from "./components/NavbarDesktop";
import Chatbot from "./components/Chatbot";

import Login_page from "./pages/Login_page";
import Inicio_page from "./pages/Inicio_page";
import Adm_users from "./pages/Adm_users";
import Adm_casas from "./pages/Adm_casas";
import Adm_personas from "./pages/Adm_personas";
import Adm_hosts from "./pages/Adm_hosts";
import Adm_reservas from "./pages/Adm_reservas";

import Vitrina_casas from "./pages/Vitrina_casas";
import Detalle_casa from "./pages/Detalle_casa";

import Mis_reservas from "./pages/Mis_reservas";
import Panel_host from "./pages/Panel_host";
import Perfil_page from "./pages/Perfil_page";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      <ToastContainer />
      {!hideNavbar && <NavbarDesktop />}

      <Routes>
        {/* ========== RUTAS PÚBLICAS ========== */}
        <Route path="/login" element={<Login_page />} />
        
        {/* Inicio - Acceso público */}
        <Route path="/" element={<Inicio_page />} />

        {/* Vitrina de casas - Acceso público */}
        <Route path="/casas" element={<Vitrina_casas />} />

        {/* Detalle de casa - Acceso público (pero reservar requiere login) */}
        <Route path="/casas/:id" element={<Detalle_casa />} />

        {/* ========== RUTAS PROTEGIDAS (Usuario logueado) ========== */}
        <Route
          path="/mis_reservas"
          element={
            <ProtectedRoute>
              <Mis_reservas />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mi-panel"
          element={
            <ProtectedRoute>
              <Panel_host />
            </ProtectedRoute>
          }
        />

        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil_page />
            </ProtectedRoute>
          }
        />

        {/* ========== RUTAS ADMIN ========== */}
        <Route
          path="/adm_users"
          element={
            <ProtectedRoute requireAdmin>
              <Adm_users />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm_clientes"
          element={
            <ProtectedRoute requireAdmin>
              <Adm_personas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm_hosts"
          element={
            <ProtectedRoute requireAdmin>
              <Adm_hosts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm_casas"
          element={
            <ProtectedRoute requireAdmin>
              <Adm_casas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm_reservas"
          element={
            <ProtectedRoute requireAdmin>
              <Adm_reservas />
            </ProtectedRoute>
          }
        />
      </Routes>

      {!hideNavbar && <Chatbot />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}