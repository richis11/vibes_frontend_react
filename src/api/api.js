import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3000", // link del backend
baseURL: "https://vibesbackendnestjs-production.up.railway.app", // link del backend
});

export default api;
// export const getCasas = () => api.get("/casas");
