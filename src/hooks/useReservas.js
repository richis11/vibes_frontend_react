import { useEffect, useState } from "react";
import reservasService from "../api/reservas_service";

const useReservas = () => {

    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const data = await reservasService.getReservas();
            setReservas([...data].reverse());
        } catch (err) {
            setError("Error al cargar reservas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, []);

    return {
        reservas,
        loading,
        error,
        refetch: fetchReservas
    };
};

export default useReservas;
