import { useEffect, useState } from "react";
import personasService from "../api/personas_service";

function usePersonas() {
  const [personas, setPersonas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPersonas = async () => {
    try {
      setLoading(true);
      const data = await personasService.getPersonas();
      setPersonas(data);
      setError(null);
    } catch (err) {
      setError("Error al cargar personas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonas();
  }, []);

  return {
    personas,
    loading,
    error,
    refetch: fetchPersonas,
  };
}

export default usePersonas;
