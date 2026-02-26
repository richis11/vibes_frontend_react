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
    // Solo redirigir a login si es un 401 Y NO es de los endpoints de autenticación
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isAuthEndpoint = url.includes('/login') || url.includes('/register');
      
      // Si el 401 es de login/register, no hacer nada (dejar que el componente maneje el error)
      if (isAuthEndpoint) {
        return Promise.reject(error);
      }
      
      // Si el 401 es de cualquier otro endpoint, significa que el token expiró
      // Limpiar sesión y redirigir al inicio (no a /login porque ahora usamos modal)
      tokenStorage.clear();
      localStorage.removeItem("user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;