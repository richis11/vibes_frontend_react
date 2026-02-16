import { useEffect, useState } from "react";
import casasService from "../api/casas_service";

function useCasas() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCasas = async () => {
    try {
      setLoading(true);
      const data = await casasService.getCasas();
      setCasas([...data].reverse());
    } catch (err) {
      setError("Error cargando casas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCasas();
  }, []);

  return { casas, loading, error, refetch: fetchCasas };
}

export default useCasas;
