import { useState, useRef, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext";
import logo from "../assets/vibes.png";

// ─── Card horizontal para cada casa ───────────────────────────────────────────
function CasaCard({ casa }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/casas/${casa.id}`)}
      style={{
        display: "flex",
        gap: 10,
        background: "#fff",
        borderRadius: 12,
        border: "1.5px solid rgba(0,180,230,0.15)",
        boxShadow: "0 2px 8px rgba(0,140,200,0.08)",
        overflow: "hidden",
        cursor: "pointer",
        marginBottom: 8,
        transition: "box-shadow 0.2s, transform 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,140,200,0.22)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,140,200,0.08)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Imagen */}
      <div style={{ width: 110, minWidth: 110, height: 90, flexShrink: 0 }}>
        {casa.imagen_principal ? (
          <img
            src={casa.imagen_principal}
            alt={casa.nombre}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #e0f7ff, #b3eaff)",
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 32,
            }}
          >
            🏠
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px 10px 0", flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700, fontSize: 14, color: "#002d44",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {casa.nombre}
        </div>
        {casa.direccion && (
          <div
            style={{
              fontSize: 12, color: "#6c9aaa", marginTop: 3,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >
            📍 {casa.direccion}
          </div>
        )}
        {casa.descripcion && (
          <div
            style={{
              fontSize: 12, color: "#8aacb8", marginTop: 3,
              display: "-webkit-box", WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical", overflow: "hidden",
            }}
          >
            {casa.descripcion}
          </div>
        )}
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: "#0090c8" }}>
            ${parseFloat(casa.precio).toFixed(2)}
            <span style={{ fontWeight: 400, fontSize: 12, color: "#6c9aaa" }}> / noche</span>
          </span>
          <span
            style={{
              fontSize: 11, background: "rgba(0,180,230,0.1)",
              color: "#0090c8", borderRadius: 6,
              padding: "3px 9px", fontWeight: 600,
            }}
          >
            Ver detalle →
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Componente principal ChatFullscreen ──────────────────────────────────────
export default function ChatFullscreen() {
  const { messages, isLoading, sendMessage } = useChat();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

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
        //height: "var(--page-h)",
        paddingTop:"55px",
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
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 40, height: 40, borderRadius: "50%",
              //background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}
          >
            <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: "#002d44" }}>Asistente Vibes</div>
            <div style={{ fontSize: 12, color: "#5aabb8" }}>
              {isLoading ? "Escribiendo..." : "En línea • Listo para ayudarte"}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 16px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>

          {/* Estado vacío con sugerencias */}
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "20px 20px 40px" }}>
              <div
                style={{
                  width: "30%", height: "30%", borderRadius: "50%",
                  //background: "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 36, margin: "0 auto 20px",
                  boxShadow: "0 8px 32px rgba(0,140,200,0.25)",
                }}
              >
                <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
              </div>
              <h2 style={{ fontWeight: 800, color: "#002d44", marginBottom: 8, fontSize: 24 }}>
                ¿A dónde quieres ir?
              </h2>
              <p style={{ color: "#5aabb8", fontSize: 16, marginBottom: 32 }}>
                Cuéntame qué buscas y te ayudo a encontrar el lugar perfecto en Ecuador.
              </p>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12, maxWidth: 700, margin: "0 auto",
                }}
              >
                {[
                  { icon: "🏖️", text: "Casas en la playa" },
                  { icon: "🏔️", text: "Algo en la sierra" },
                  { icon: "💰", text: "Opciones económicas" },
                  { icon: "📍", text: "¿En qué zonas hay casas?" },
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion.text)}
                    style={{
                      padding: "14px 16px", borderRadius: 12,
                      border: "1.5px solid rgba(0,180,230,0.2)",
                      background: "#fff", cursor: "pointer",
                      textAlign: "left", transition: "all 0.2s",
                      fontSize: 14, color: "#002d44",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#00b4e6";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,180,230,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(0,180,230,0.2)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <span style={{ fontSize: 20, marginRight: 8 }}>{suggestion.icon}</span>
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Mensajes
            <>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      maxWidth: "75%",
                      flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                      width: msg.casas?.length > 0 ? "75%" : "auto",
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        background: msg.sender === "user"
                          ? "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)"
                          : "#fff",
                        border: msg.sender === "bot" ? "2px solid rgba(0,180,230,0.2)" : "none",
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                      }}
                    >
                      {msg.sender === "user" ? (
                        "👤"
                      ) : (
                        <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                      )}
                    </div>

                    {/* Burbuja + cards */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Burbuja de texto */}
                      <div
                        style={{
                          padding: "12px 16px",
                          borderRadius: 16,
                          background: msg.sender === "user" ? "#0090c8" : "#fff",
                          color: msg.sender === "user" ? "#fff" : "#002d44",
                          fontSize: 15, lineHeight: 1.6,
                          whiteSpace: "pre-wrap", wordBreak: "break-word",
                          boxShadow: msg.sender === "user"
                            ? "0 2px 8px rgba(0,140,200,0.2)"
                            : "0 2px 8px rgba(0,140,200,0.1)",
                          marginBottom: msg.casas?.length > 0 ? 10 : 0,
                        }}
                      >
                        {msg.text}
                      </div>

                      {/* Cards de casas */}
                      {msg.sender === "bot" && msg.casas?.length > 0 && (
                        <div>
                          {msg.casas.map((casa) => (
                            <CasaCard key={casa.id} casa={casa} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <div
                    style={{
                      width: 36, height: 36, borderRadius: "50%",
                      background: "#fff", border: "2px solid rgba(0,180,230,0.2)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <img src={logo} alt="Logo" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                  </div>
                  <div
                    style={{
                      padding: "12px 16px", borderRadius: 16,
                      background: "#fff", boxShadow: "0 2px 8px rgba(0,140,200,0.1)",
                      display: "flex", gap: 6, alignItems: "center",
                    }}
                  >
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <div
                        key={i}
                        style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: "#0090c8",
                          animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
                        }}
                      />
                    ))}
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
          <Form onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
              <div style={{ flex: 1, position: "relative" }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Cuéntame qué buscas... (Enter para enviar)"
                  disabled={isLoading}
                  rows={1}
                  style={{
                    width: "100%", padding: "14px 16px",
                    borderRadius: 14, resize: "none", overflow: "hidden",
                    border: "1.5px solid rgba(0,180,230,0.25)",
                    fontSize: 15, outline: "none",
                    fontFamily: "'DM Sans', sans-serif",
                    background: isLoading ? "#f8f9fa" : "#fff",
                    color: "#002d44", lineHeight: 1.5,
                    boxShadow: "0 2px 8px rgba(0,140,200,0.06)",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#00b4e6")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(0,180,230,0.25)")}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                style={{
                  padding: "14px 24px", borderRadius: 14,
                  background: isLoading || !input.trim()
                    ? "rgba(0,180,230,0.3)"
                    : "linear-gradient(135deg, #00c6f0 0%, #0090c8 100%)",
                  border: "none", fontWeight: 700, fontSize: 15,
                  color: "#fff", cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                  boxShadow: isLoading || !input.trim() ? "none" : "0 4px 16px rgba(0,140,200,0.3)",
                  transition: "all 0.2s", whiteSpace: "nowrap",
                }}
              >
                {isLoading ? "..." : "Enviar ↑"}
              </Button>
            </div>
          </Form>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}