import { createContext, useContext, useState, useEffect } from "react";

const ModeContext = createContext(null);

// Modos disponibles
export const MODES = {
  GUEST: "guest",    // Modo Cliente/Huésped
  HOST: "host",      // Modo Anfitrión
};

export function ModeProvider({ children }) {
  // Por defecto, modo guest
  const [currentMode, setCurrentMode] = useState(() => {
    // Recuperar modo guardado de localStorage
    return localStorage.getItem("vibes_user_mode") || MODES.GUEST;
  });

  // Guardar modo en localStorage cuando cambia
  useEffect(() => {
    localStorage.setItem("vibes_user_mode", currentMode);
  }, [currentMode]);

  const switchToGuest = () => {
    setCurrentMode(MODES.GUEST);
  };

  const switchToHost = () => {
    setCurrentMode(MODES.HOST);
  };

  const toggleMode = () => {
    setCurrentMode((prev) => (prev === MODES.GUEST ? MODES.HOST : MODES.GUEST));
  };

  const isGuestMode = currentMode === MODES.GUEST;
  const isHostMode = currentMode === MODES.HOST;

  return (
    <ModeContext.Provider
      value={{
        currentMode,
        isGuestMode,
        isHostMode,
        switchToGuest,
        switchToHost,
        toggleMode,
      }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error("useMode debe usarse dentro de <ModeProvider>");
  }
  return context;
}
