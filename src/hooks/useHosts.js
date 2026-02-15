import { useEffect, useState } from "react";
import hostsService from "../api/hosts_service";

const useHosts = () => {

    const [hosts, setHosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchHosts = async () => {
        try {
            setLoading(true);
            const data = await hostsService.getHosts();
            setHosts([...data].reverse());
        } catch (err) {
            setError("Error al cargar usuarios");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHosts();
    }, []);

    return {
        hosts,
        loading,
        error,
        refetch: fetchHosts
    };
};

export default useHosts;
