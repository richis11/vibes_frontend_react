import api from "./api";

const baseURL = "/users";

const buscarUsers= async(query)=>{
    //return (await api.get(`${baseURL}/search/?query=${query}`)).data;
    return (await api.get(`${baseURL}/buscar?q=${query}`)).data;
}
const getUsers= async()=>{
    return (await api.get(`${baseURL}`)).data;
}
const getUsersDisponibles= async()=>{
    return (await api.get(`${baseURL}/usersDisponibles`)).data;
}
const getUser= async(id)=>{
    return (await api.get(`${baseURL}/${id}`)).data;
}
const crearUser = async(user)=>{
    return (await api.post(`${baseURL}`, user))
}
const editarUser= async(id, user)=>{
    return (await api.put(`${baseURL}/${id}`, user));
}
const eliminarUser= async(id)=>{
    return (await api.delete(`${baseURL}/${id}`));
}


const getNewUsers= async()=>{
    return (await api.get(`${baseURL}/new/users/`)).data;
}


export default {
    getUsers,
    getUsersDisponibles,
    getUser,
    crearUser,
    editarUser,
    eliminarUser,
    getNewUsers,
    buscarUsers
}