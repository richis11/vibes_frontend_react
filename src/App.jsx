import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
//import logo from "./assets/vibes.png";

import { Routes, Route, useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";

import Chatbot from "./components/Chatbot";
import NavbarDesktop from "./components/NavbarDesktop";
import Adm_casas from './pages/Adm_casas';
import Adm_clientes from './pages/Adm_clientes';
import Adm_reservas from './pages/Adm_reservas';
import Inicio_page from "./pages/Inicio_page";


function App() {
  return (
    <>
      <ToastContainer />
      {/* <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {/* <h1>Vibes</h1> */}

    <NavbarDesktop />

    <Routes>
        <Route path="/" element={ <Inicio_page/>} />
        <Route path="/adm_casas" element={ <Adm_casas/>} />
        <Route path="/adm_clientes" element={ <Adm_clientes/>} />
        <Route path="/adm_reservas" element={ <Adm_reservas/>} />
    </Routes>

    {/* <Adm_casas/>
    <Adm_clientes/>
    <Adm_reservas/> */}

      {/* <img
        src={logo}
        alt="Logo del chat"
        style={{ width: "75%", height: "75%", borderRadius: "50%" }}
      /> */}
      

      <Chatbot/>
    </>
  );
}

export default App;
