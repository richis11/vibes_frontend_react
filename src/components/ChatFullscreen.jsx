import { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useChat } from "../context/ChatContext";
import logo from "../assets/vibes.png";

export default function ChatFullscreen() {
  const { messages, isLoading, sendMessage } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    await sendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "linear-gradient(180deg, #edfaff 0%, #f5feff 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          background: "#fff",
          borderBottom: "1px solid rgba(0,180,230,0.15)",
          boxShadow: "0 2px 8px rgba(0,140,200,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
            }}
          >
            🤖
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#002d44" }}>
              Asistente Vibes
            </div>
            <div style={{ fontSize: 12, color: "#5aabb8" }}>
              {isLoading ? "Escribiendo..." : "En línea • Listo para ayudarte"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 16px",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          {messages.length === 0 ? (
            // Empty state
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: "50%",
                  //background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 48,
                  marginBottom: 24,
                  boxShadow: "0 8px 32px rgba(0,180,230,0.3)",
                }}
              >
                <img
                  src={logo}
                  alt="Logo del chat"
                  style={{ width: "100%", height: "100%", borderRadius: "50%" }}
                />
              </div>
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 32,
                  fontWeight: 800,
                  color: "#002d44",
                  marginBottom: 12,
                }}
              >
                ¡Bienvenido a Vibes!
              </h2>
              <p
                style={{
                  fontSize: 16,
                  color: "#5aabb8",
                  maxWidth: 500,
                  margin: "0 auto 24px",
                }}
              >
                Soy tu asistente virtual. Puedo ayudarte a buscar casas,
                responder preguntas sobre reservas, o cualquier otra cosa que
                necesites.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                  gap: 12,
                  width: "100%",
                  maxWidth: 600,
                  marginTop: 24,
                }}
              >
                {[
                  { icon: "🏠", text: "¿Qué casas tienen disponibles?" },
                  { icon: "📅", text: "¿Cómo hago una reserva?" },
                  { icon: "💰", text: "¿Cuáles son los precios?" },
                  { icon: "📍", text: "¿En qué zonas hay casas?" },
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.text)}
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      border: "1.5px solid rgba(0,180,230,0.2)",
                      background: "#fff",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.2s",
                      fontSize: 14,
                      color: "#002d44",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = "#00b4e6";
                      e.target.style.boxShadow =
                        "0 4px 16px rgba(0,180,230,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = "rgba(0,180,230,0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ fontSize: 20, marginRight: 8 }}>
                      {suggestion.icon}
                    </span>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Messages
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      maxWidth: "75%",
                      flexDirection:
                        msg.sender === "user" ? "row-reverse" : "row",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background:
                          msg.sender === "user"
                            ? "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)"
                            : "#fff",
                        border:
                          msg.sender === "bot"
                            ? "2px solid rgba(0,180,230,0.2)"
                            : "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                        flexShrink: 0,
                      }}
                    >
                      {msg.sender === "user" ? (
                        "👤"
                      ) : (
                        <img
                          src={logo}
                          alt="Logo del chat"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                          }}
                        />
                      )}
                    </div>

                    {/* Message bubble */}
                    <div
                      style={{
                        padding: "12px 16px",
                        borderRadius: 16,
                        background: msg.sender === "user" ? "#0090c8" : "#fff",
                        color: msg.sender === "user" ? "#fff" : "#002d44",
                        fontSize: 15,
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        boxShadow:
                          msg.sender === "user"
                            ? "0 2px 8px rgba(0,140,200,0.2)"
                            : "0 2px 8px rgba(0,140,200,0.1)",
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "#fff",
                      border: "2px solid rgba(0,180,230,0.2)",
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
                  <div
                    style={{
                      padding: "12px 16px",
                      borderRadius: 16,
                      background: "#fff",
                      boxShadow: "0 2px 8px rgba(0,140,200,0.1)",
                      display: "flex",
                      gap: 6,
                    }}
                  >
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
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div
        style={{
          padding: "16px 24px 24px",
          background: "#fff",
          borderTop: "1px solid rgba(0,180,230,0.15)",
          boxShadow: "0 -2px 8px rgba(0,140,200,0.08)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
          >
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escribe tu mensaje... (Shift + Enter para nueva línea)"
                  disabled={isLoading}
                  style={{
                    width: "100%",
                    minHeight: 52,
                    maxHeight: 200,
                    padding: "14px 16px",
                    borderRadius: 12,
                    border: "1.5px solid rgba(0,180,230,0.25)",
                    fontSize: 15,
                    fontFamily: "'DM Sans', sans-serif",
                    resize: "none",
                    outline: "none",
                    transition: "border 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00b4e6")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = "rgba(0,180,230,0.25)")
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                style={{
                  padding: "14px 24px",
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: 15,
                  minWidth: 100,
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) =>
                  !isLoading && (e.target.style.transform = "translateY(-2px)")
                }
                onMouseLeave={(e) =>
                  (e.target.style.transform = "translateY(0)")
                }
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </Form>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 11,
              color: "#8bb8c8",
              textAlign: "center",
            }}
          >
            Presiona Enter para enviar • Shift + Enter para nueva línea
          </p>
        </div>
      </div>

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
    </div>
  );
}
