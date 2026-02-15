import { useEffect, useState } from "react";
import usersService from "../api/users_service";

const useUsersDisponibles = () => {

    const [usersDisponibles, setUsersDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersService.getUsersDisponibles();
            setUsersDisponibles([...data].reverse());
        } catch (err) {
            setError("Error al cargar usuarios disponibles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        usersDisponibles,
        loading,
        error,
        refetch: fetchUsers
    };
};

export default useUsersDisponibles;