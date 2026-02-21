import api from "./api";

const baseURL = "/reservas";

const buscarReservas = async (query) => {
    return (await api.get(`${baseURL}/buscar?q=${query}`)).data;
}

const getReservas = async () => {
    return (await api.get(`${baseURL}`)).data;
}

const getReserva = async (id) => {
    return (await api.get(`${baseURL}/${id}`)).data;
}

const getReservasPorGuest = async (guestId) => {
    return (await api.get(`${baseURL}/guest/${guestId}`)).data;
}

const crearReserva = async (reserva) => {
    return (await api.post(`${baseURL}`, reserva));
}

const editarReserva = async (id, reserva) => {
    return (await api.put(`${baseURL}/${id}`, reserva));
}

const eliminarReserva = async (id) => {
    return (await api.delete(`${baseURL}/${id}`));
}

const getNewReservas = async () => {
    return (await api.get(`${baseURL}/new/reservas/`)).data;
}

export default {
    getReservas,
    getReserva,
    getReservasPorGuest,
    crearReserva,
    editarReserva,
    eliminarReserva,
    getNewReservas,
    buscarReservas
}