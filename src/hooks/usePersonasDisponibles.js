import { useEffect, useState } from "react";
import personasService from "../api/personas_service";

const usePersonasDisponibles = () => {

    const [personasDisponibles, setPersonasDisponibles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPersonas = async () => {
        try {
            setLoading(true);
            const data = await personasService.getPersonasDisponibles();
            setPersonasDisponibles([...data].reverse());
        } catch (err) {
            setError("Error al cargar personas disponibles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonas();
    }, []);

    return {
        personasDisponibles,
        loading,
        error,
        refetch: fetchPersonas
    };
};

export default usePersonasDisponibles;