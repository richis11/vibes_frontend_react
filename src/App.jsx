import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/AuthContext";
import { LoginModalProvider, useLoginModal } from "./context/LoginModalContext";
import { ChatProvider } from "./context/ChatContext";
import { ModeProvider, MODES } from "./context/ModeContext";

import ProtectedRoute from "./components/ProtectedRoute";
import ModeProtectedRoute from "./components/ModeProtectedRoute";

import NavbarDesktop from "./components/NavbarDesktop";
import Chatbot from "./components/Chatbot";
import Modal_login from "./components/Modal_login";

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
import Reservas_anfitrion from "./pages/Reservas_anfitrion";
import Perfil_page from "./pages/Perfil_page";

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";
  const hideChatbot = location.pathname === "/"; // No mostrar chatbot flotante en inicio
  const isInicio = location.pathname === "/";    // La página de inicio maneja su propio layout
  const { showLoginModal, closeLoginModal, handleLoginSuccess } = useLoginModal();

  return (
    <>
      <ToastContainer />
      {!hideNavbar && <NavbarDesktop />}

      {/*
        Cuando el navbar está visible y NO es la página de inicio,
        agregamos paddingTop para que el contenido quede debajo del navbar fijo.
        El navbar de Bootstrap con fixed="top" mide ~64px.
        La página de inicio (ChatFullscreen) maneja su propio height: 100vh internamente.
      */}
      <main>
        <Routes>
          {/* ========== RUTAS PÚBLICAS ========== */}
          <Route path="/login" element={<Navigate to="/" replace />} />

          {/* Inicio - Chat fullscreen */}
          <Route path="/" element={<Inicio_page />} />

          {/* Casas - Acceso público */}
          <Route path="/casas" element={<Vitrina_casas />} />

          {/* Detalle de casa - Acceso público */}
          <Route path="/casas/:id" element={<Detalle_casa />} />

          {/* ========== RUTAS MODO CLIENTE (requieren login Y modo GUEST) ========== */}
          <Route
            path="/mis_reservas"
            element={
              <ProtectedRoute>
                <ModeProtectedRoute requiredMode={MODES.GUEST}>
                  <Mis_reservas />
                </ModeProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* ========== RUTAS MODO ANFITRIÓN (requieren login Y modo HOST) ========== */}
          <Route
            path="/mi-panel"
            element={
              <ProtectedRoute>
                <ModeProtectedRoute requiredMode={MODES.HOST}>
                  <Panel_host />
                </ModeProtectedRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/reservas-anfitrion"
            element={
              <ProtectedRoute>
                <ModeProtectedRoute requiredMode={MODES.HOST}>
                  <Reservas_anfitrion />
                </ModeProtectedRoute>
              </ProtectedRoute>
            }
          />

          {/* ========== RUTA DE PERFIL (ambos modos) ========== */}
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil_page />
              </ProtectedRoute>
            }
          />

          {/* ========== RUTAS ADMIN (ambos modos) ========== */}
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
      </main>

      {/* Chatbot flotante - solo visible fuera de la página de inicio */}
      {!hideNavbar && !hideChatbot && <Chatbot />}

      {/* Modal de login global */}
      <Modal_login
        show={showLoginModal}
        onClose={closeLoginModal}
        onSuccess={handleLoginSuccess}
      />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LoginModalProvider>
        <ChatProvider>
          <ModeProvider>
            <AppLayout />
          </ModeProvider>
        </ChatProvider>
      </LoginModalProvider>
    </AuthProvider>
  );
}