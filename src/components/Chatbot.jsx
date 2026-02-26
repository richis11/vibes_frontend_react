import { useState, useRef, useEffect } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useChat } from "../context/ChatContext";
import logo from "../assets/vibes.png";

function Chatbot() {
  const { messages, isLoading, sendMessage } = useChat();

  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const chatBodyRef = useRef(null);
  const lastBotMessageRef = useRef(null);
  const inputRef = useRef(null);
  const [chatHeight, setChatHeight] = useState(500);

  // Enviar mensaje
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
  };

  // Detectar teclado en pantalla (mobile)
  useEffect(() => {
    if (!window.visualViewport) return;

    const handleResize = () => {
      const vh = window.visualViewport.height;
      const fullHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;

      if (!isMobile) return;

      const diff = fullHeight - vh;
      const keyboardOpen = diff > 150;

      if (keyboardOpen) {
        setChatHeight(vh - 10);
      } else {
        setChatHeight(vh - 110);
      }
    };

    window.visualViewport.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  // Auto-scroll al recibir mensajes
  useEffect(() => {
    if (!messages.length) return;

    const lastMessage = messages[messages.length - 1];

    if (lastMessage.sender === "user" && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }

    if (lastMessage.sender === "bot" && lastBotMessageRef.current) {
      lastBotMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  return (
    <>
      {/* Chat flotante */}
      {isOpen && (
        <div className="chat-wrapper" style={{ zIndex: 2000 }}>
          <Card
            className="chat-mobile shadow"
            style={{
              position: "fixed",
              bottom: 90,
              right: 20,
              width: 420,
              maxWidth: "calc(100vw - 40px)",
              height: chatHeight,
              zIndex: 1000,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            {/* Header del chat */}
            <div
              style={{
                padding: "14px 16px",
                background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "rgb(255, 255, 255)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                  }}
                >
                  <img
                    src={logo}
                    alt="Logo del chat"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>
                    Asistente Vibes
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.9 }}>
                    {isLoading ? "Escribiendo..." : "En línea"}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: 24,
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </div>

            {/* Cuerpo del chat con mensajes */}
            <Card.Body
              ref={chatBodyRef}
              style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                padding: 16,
                background: "#f8f9fa",
              }}
            >
              {messages.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#6c757d",
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 10 }}>👋</div>
                  <p style={{ margin: 0, fontSize: 14 }}>
                    ¡Hola! Soy tu asistente virtual.
                    <br />
                    ¿En qué puedo ayudarte hoy?
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isLastBotMessage =
                    msg.sender === "bot" && index === messages.length - 1;

                  return (
                    <div
                      key={index}
                      ref={isLastBotMessage ? lastBotMessageRef : null}
                      className="shadow-sm"
                      style={{
                        alignSelf:
                          msg.sender === "user" ? "flex-end" : "flex-start",
                        backgroundColor:
                          msg.sender === "user" ? "#0090c8" : "#fff",
                        color: msg.sender === "user" ? "#fff" : "#212529",
                        padding: "10px 14px",
                        borderRadius: 12,
                        marginBottom: 8,
                        maxWidth: "75%",
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                        wordBreak: "break-word",
                        textAlign: "left",
                        fontSize: 14,
                        lineHeight: 1.5,
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                })
              )}

              {/* Indicador de carga */}
              {isLoading && (
                <div
                  style={{
                    alignSelf: "flex-start",
                    backgroundColor: "#fff",
                    padding: "10px 14px",
                    borderRadius: 12,
                    marginBottom: 8,
                  }}
                  className="shadow-sm"
                >
                  <div style={{ display: "flex", gap: 4 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#0090c8",
                        animation: "pulse 1.4s ease-in-out infinite",
                      }}
                    />
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#0090c8",
                        animation: "pulse 1.4s ease-in-out 0.2s infinite",
                      }}
                    />
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: "#0090c8",
                        animation: "pulse 1.4s ease-in-out 0.4s infinite",
                      }}
                    />
                  </div>
                </div>
              )}
            </Card.Body>

            {/* Footer con input */}
            <Card.Footer style={{ background: "#fff", padding: 12 }}>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <div style={{ display: "flex", gap: 8 }}>
                  <Form.Control
                    ref={inputRef}
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    style={{
                      borderRadius: 10,
                      border: "1.5px solid rgba(0,180,230,0.2)",
                      fontSize: 14,
                    }}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    style={{
                      borderRadius: 10,
                      padding: "8px 20px",
                      background:
                        "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                      border: "none",
                      fontWeight: 600,
                    }}
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </div>
      )}

      {/* Botón flotante para abrir/cerrar */}
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          zIndex: 1000,
          borderRadius: "50%",
          width: 60,
          height: 60,
          padding: 0,
          background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
          border: "none",
          boxShadow: "0 4px 20px rgba(0,140,200,0.4)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
      >
        {isOpen ? "✕" : "💬"}
      </Button>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
}

export default Chatbot;
