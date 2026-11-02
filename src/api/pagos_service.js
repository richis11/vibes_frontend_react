import api from "./api";

const baseURL = "/pagos";

// Huésped
const subirComprobante = async (reservaId, file, referencia = "") => {
    const formData = new FormData();
    formData.append("comprobante", file);
    if (referencia.trim()) formData.append("referencia", referencia.trim());
    return (
        await api.post(`${baseURL}/reserva/${reservaId}/comprobante`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
    ).data;
}

const getPagosDeReserva = async (reservaId) => {
    return (await api.get(`${baseURL}/reserva/${reservaId}`)).data;
}

const getMisPagos = async () => {
    return (await api.get(`${baseURL}/mios`)).data;
}

// Admin
const getPagos = async (estado) => {
    return (await api.get(`${baseURL}`, { params: estado ? { estado } : {} })).data;
}

const aprobarPago = async (id) => {
    return (await api.put(`${baseURL}/${id}/aprobar`)).data;
}

const rechazarPago = async (id, motivo) => {
    return (await api.put(`${baseURL}/${id}/rechazar`, { motivo })).data;
}

export default {
    subirComprobante,
    getPagosDeReserva,
    getMisPagos,
    getPagos,
    aprobarPago,
    rechazarPago,
}
