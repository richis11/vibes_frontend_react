import api from "./api";

const login = async ({ email, password }) => {
  return (await api.post("/login", { email, password })).data;
};

const register = async ({ email, password, nombres, apellidos, fecha_nacimiento }) => {
  return (await api.post("/register", { email, password, nombres, apellidos, fecha_nacimiento })).data;
};

export default { login, register };