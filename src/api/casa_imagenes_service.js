import api from "./api";

const baseURL = "/casa-imagenes";

const getImagenesPorCasa = async (casaId) => {
  return (await api.get(`${baseURL}/${casaId}`)).data;
};

const subirImagen = async (casaId, file, esPrincipal = false) => {
  const formData = new FormData();
  formData.append("imagen", file);
  return (
    await api.post(`${baseURL}/upload/${casaId}?principal=${esPrincipal}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
  ).data;
};

const marcarPrincipal = async (casaId, imagenId) => {
  return (await api.patch(`${baseURL}/${casaId}/principal/${imagenId}`)).data;
};

const eliminarImagen = async (imagenId) => {
  return (await api.delete(`${baseURL}/${imagenId}`)).data;
};

export default {
  getImagenesPorCasa,
  subirImagen,
  marcarPrincipal,
  eliminarImagen,
};