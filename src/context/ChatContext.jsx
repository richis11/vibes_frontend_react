import { createContext, useContext, useState, useCallback } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para enviar mensaje al chatbot
  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // Agregar mensaje del usuario
    const userMsg = { sender: "user", text: userMessage, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://vibeschatbotpython-production.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userMessage }),
        }
      );

      const data = await response.json();
      
      // Agregar respuesta del bot
      const botMsg = { sender: "bot", text: data.reply, timestamp: Date.now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      
      // Mensaje de error
      const errorMsg = { 
        sender: "bot", 
        text: "Ups! Ocurrió un error 🤯. Por favor intenta de nuevo.", 
        timestamp: Date.now() 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Función para limpiar el chat
  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  // Función para agregar mensaje del sistema (ej: bienvenida)
  const addSystemMessage = useCallback((text) => {
    const systemMsg = { 
      sender: "bot", 
      text, 
      timestamp: Date.now(),
      isSystem: true 
    };
    setMessages((prev) => [...prev, systemMsg]);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearChat,
        addSystemMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat debe usarse dentro de <ChatProvider>");
  }
  return context;
}
