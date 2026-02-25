// src/api/api.js
import axios from "axios";
import { tokenStorage } from "../utils/tokenStorage";

const api = axios.create({
  //baseURL: "https://vibesbackendnestjs-production.up.railway.app",
   baseURL: "http://localhost:3000", // Para desarrollo local
});

// 👇 Interceptor para agregar el token automáticamente
api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 👇 Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar sesión
      tokenStorage.clear();
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;