import { useEffect, useState } from "react";
import usersService from "../api/users_service";

const useUsers = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const data = await usersService.getUsers();
            setUsers([...data].reverse());
        } catch (err) {
            setError("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return {
        users,
        loading,
        error,
        refetch: fetchUsers
    };
};

export default useUsers;
