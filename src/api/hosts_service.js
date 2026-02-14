import api from "./api";

const baseURL = "/hosts";

const buscarHosts = async (query) => {
    return (await api.get(`${baseURL}/buscar?q=${query}`)).data;
}

const getHosts = async () => {
    return (await api.get(`${baseURL}`)).data;
}

const getHost = async (id) => {
    return (await api.get(`${baseURL}/${id}`)).data;
}

const crearHost = async (host) => {
    return (await api.post(`${baseURL}`, host));
}

const editarHost = async (id, host) => {
    return (await api.put(`${baseURL}/${id}`, host));
}

const eliminarHost = async (id) => {
    return (await api.delete(`${baseURL}/${id}`));
}

const getNewHosts = async () => {
    return (await api.get(`${baseURL}/new/hosts/`)).data;
}

export default {
    getHosts,
    getHost,
    crearHost,
    editarHost,
    eliminarHost,
    getNewHosts,
    buscarHosts
}
