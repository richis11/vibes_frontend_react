import { createContext, useContext, useState, useEffect } from "react";
import { tokenStorage } from "../utils/tokenStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);       // { id, email, is_admin, nombres, apellidos }
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // para no flashear rutas antes de leer storage

  // Al montar, recuperar sesión guardada
  useEffect(() => {
    const savedToken = tokenStorage.get();
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (tokenValue, userData, remember = false) => {
    tokenStorage.save(tokenValue, remember);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(tokenValue);
    setUser(userData);
  };

  const logout = () => {
    tokenStorage.clear();
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin   = user?.is_admin === true;
  const isHost    = !!user?.host_id;
  const isLoggedIn = !!token && !!user;

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isAdmin, isHost, isLoggedIn,
      login, logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}