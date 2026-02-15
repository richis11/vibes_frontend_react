import api from "./api";

const baseURL = "/personas";

const buscarPersonas = async (query) => {
  return (await api.get(`${baseURL}/buscar?q=${query}`)).data;
};

const getPersonas = async () => {
  return (await api.get(`${baseURL}`)).data;
};

const getPersonasDisponibles= async()=>{
    return (await api.get(`${baseURL}/personasDisponibles`)).data;
}

const getPersona = async (id) => {
  return (await api.get(`${baseURL}/${id}`)).data;
};

const crearPersona = async (persona) => {
  return await api.post(`${baseURL}`, persona);
};

const editarPersona = async (id, persona) => {
  return await api.put(`${baseURL}/${id}`, persona);
};

const eliminarPersona = async (id) => {
  return await api.delete(`${baseURL}/${id}`);
};

const getNewPersonas = async () => {
  return (await api.get(`${baseURL}/new/personas/`)).data;
};

export default {
  getPersonas,
  getPersonasDisponibles,
  getPersona,
  crearPersona,
  editarPersona,
  eliminarPersona,
  getNewPersonas,
  buscarPersonas,
};
