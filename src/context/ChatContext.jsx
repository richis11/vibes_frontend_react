     import { createContext, useContext, useState, useRef, useCallback } from "react";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ref para leer el historial actualizado sin cerrar sobre estado viejo
  const messagesRef = useRef([]);

  const sendMessage = useCallback(async (userMessage) => {
    if (!userMessage.trim()) return;

    // 1. Agregar mensaje del usuario
    const userMsg = { sender: "user", text: userMessage, timestamp: Date.now() };
    const updatedMessages = [...messagesRef.current, userMsg];
    messagesRef.current = updatedMessages;
    setMessages(updatedMessages);
    setIsLoading(true);

    // 2. Construir historial para el backend (todo excepto el mensaje actual)
    const historial = messagesRef.current
      .slice(0, -1)
      .filter((m) => m.sender === "user" || m.sender === "bot")
      .map((m) => ({
        role: m.sender === "user" ? "user" : "assistant",
        content: m.text,
      }));

    try {
      const response = await fetch(
        //"https://vibeschatbotpython-production.up.railway.app/chat",
          "http://localhost:8000/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: userMessage,
            history: historial,
          }),
        }
      );

      const data = await response.json();

      // El backend ahora devuelve { reply, casas }
      const botMsg = {
        sender: "bot",
        text: data.reply,
        casas: data.casas || [],   // <-- guardamos las casas junto al mensaje
        timestamp: Date.now(),
      };
      const withBot = [...messagesRef.current, botMsg];
      messagesRef.current = withBot;
      setMessages(withBot);

    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      const errorMsg = {
        sender: "bot",
        text: "Ups! Ocurrió un error 🤯. Por favor intenta de nuevo.",
        casas: [],
        timestamp: Date.now(),
      };
      const withError = [...messagesRef.current, errorMsg];
      messagesRef.current = withError;
      setMessages(withError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    messagesRef.current = [];
    setMessages([]);
  }, []);

  const addSystemMessage = useCallback((text) => {
    const systemMsg = { sender: "bot", text, casas: [], timestamp: Date.now(), isSystem: true };
    const updated = [...messagesRef.current, systemMsg];
    messagesRef.current = updated;
    setMessages(updated);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isLoading, sendMessage, clearChat, addSystemMessage }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat debe usarse dentro de <ChatProvider>");
  return context;
}