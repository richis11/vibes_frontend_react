import { createContext, useContext, useState } from "react";

const LoginModalContext = createContext(null);

export function LoginModalProvider({ children }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [onLoginSuccess, setOnLoginSuccess] = useState(null);

  const openLoginModal = (callback) => {
    setShowLoginModal(true);
    if (callback) {
      // Guardar callback como función
      setOnLoginSuccess(() => callback);
    }
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setOnLoginSuccess(null);
  };

  const handleLoginSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    closeLoginModal();
  };

  return (
    <LoginModalContext.Provider
      value={{
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        handleLoginSuccess,
      }}
    >
      {children}
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const ctx = useContext(LoginModalContext);
  if (!ctx) {
    throw new Error("useLoginModal debe usarse dentro de <LoginModalProvider>");
  }
  return ctx;
}