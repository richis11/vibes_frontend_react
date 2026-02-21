import api from "./api";

const baseURL = "/casas";

const buscarCasas = async (query) => {
  return (await api.get(`${baseURL}/buscar?q=${query}`)).data;
};

const getCasas = async () => {
  return (await api.get(`${baseURL}`)).data;
};

const getCasasPorHost = async (hostId) => {
  return (await api.get(`${baseURL}/host/${hostId}`)).data;
};

const getCasa = async (id) => {
  return (await api.get(`${baseURL}/${id}`)).data;
};

const crearCasa = async (casa) => {
  return await api.post(`${baseURL}`, casa);
};

const editarCasa = async (id, casa) => {
  return await api.put(`${baseURL}/${id}`, casa);
};

const eliminarCasa = async (id) => {
  return await api.delete(`${baseURL}/${id}`);
};

const getNewCasas = async () => {
  return (await api.get(`${baseURL}/new/casas/`)).data;
};

export default {
  getCasas,
  getCasasPorHost,
  getCasa,
  crearCasa,
  editarCasa,
  eliminarCasa,
  getNewCasas,
  buscarCasas,
};
