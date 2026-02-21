import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-toastify/dist/ReactToastify.css";

import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { AuthProvider } from "./context/Authcontext";
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

function AppLayout() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login";

  return (
    <>
      <ToastContainer />
      {!hideNavbar && <NavbarDesktop />}

      <Routes>
        {/* Pública */}
        <Route path="/login" element={<Login_page />} />

        {/* Cualquier usuario logueado */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Inicio_page />
            </ProtectedRoute>
          }
        />
        <Route
          path="/adm_casas"
          element={
            <ProtectedRoute>
              <Adm_casas />
            </ProtectedRoute>
          }
        />

        {/* Solo admin */}
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
