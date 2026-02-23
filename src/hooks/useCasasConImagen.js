import { useEffect, useState } from "react";
import casasService from "../api/casas_service";
import casaImagenesService from "../api/casa_imagenes_service";

function useCasasConImagen() {
  const [casas, setCasas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCasas = async () => {
    try {
      setLoading(true);
      const data = await casasService.getCasas();
      const ordenadas = [...data].reverse();

      // Cargar imagen principal de todas las casas en paralelo
      const casasConImagen = await Promise.all(
        ordenadas.map(async (casa) => {
          try {
            const imagenes = await casaImagenesService.getImagenesPorCasa(casa.id);
            const principal = imagenes.find((img) => img.es_principal) ?? imagenes[0];
            return { ...casa, imagen_principal: principal?.url ?? null };
          } catch {
            return { ...casa, imagen_principal: null };
          }
        })
      );

      setCasas(casasConImagen);
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

export default useCasasConImagen;