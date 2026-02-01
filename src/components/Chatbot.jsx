import React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, Form, Button, InputGroup, Badge } from "react-bootstrap";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null); // Para hacer scroll automático
  const lastBotMessageRef = useRef(null); // para focus en inicio del mensaje del bot
  const [isOpen, setIsOpen] = useState(false); // para mostrar u ocultar el chat
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const userInput = input;
    setInput("");

    try {
      //const response = await fetch("http://localhost:8000/chat", {
      const response = await fetch(
        "https://vibeschatbotpython-production.up.railway.app/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: userInput }),
        }
      );

      const data = await response.json();

      setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Ups! Ocurrió un error 🤯" },
      ]);
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  

  useEffect(() => {
    if (!messages.length) return;

    const lastMessage = messages[messages.length - 1];

    // 🧍 Usuario habló → ir al final
    if (lastMessage.sender === "user" && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }

    // 🤖 Bot habló → ir al inicio de su mensaje
    if (lastMessage.sender === "bot" && lastBotMessageRef.current) {
      lastBotMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [messages]);

  return (
    <>
      {/* <h3>CHATBOT</h3> */}
      {isOpen && (
        <div className="chat-wrapper">
          <Card
            className="chat-mobile"
            // className="chat-card"

            style={{
              position: "fixed",
              bottom: "90px", // justo encima del botón
              right: "20px",
              width: "420px",
              maxWidth: "420px",
              height: "500px",
              zIndex: 1000,
            }}
          >
            {/* Cuerpo del chat con scroll */}
            <Card.Body
              ref={chatBodyRef}
              style={{
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {messages.map((msg, index) => {
                const isLastBotMessage =
                  msg.sender === "bot" && index === messages.length - 1;

                return (
                  <div
                    key={index}
                    ref={isLastBotMessage ? lastBotMessageRef : null}
                    style={{
                      alignSelf:
                        msg.sender === "user" ? "flex-end" : "flex-start",
                      backgroundColor:
                        msg.sender === "user" ? "#0d6efd" : "#dadada",
                      color: msg.sender === "user" ? "white" : "black",
                      padding: "8px 12px",
                      borderRadius: "15px",
                      marginBottom: "8px",
                      maxWidth: "70%",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                      textAlign: "left",
                    }}
                  >
                    {msg.text}
                  </div>
                );
              })}
            </Card.Body>

            {/* Footer con input */}
            <Card.Footer>
              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <div className="d-flex">
                  <Form.Control
                    ref={inputRef}
                    type="text"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button
                    variant="primary"
                    onClick={handleSend}
                    className="ms-2"
                  >
                    Enviar
                  </Button>
                </div>
              </Form>
            </Card.Footer>
          </Card>
        </div>
      )}

      <Button
        variant="primary"
        onClick={() => setIsOpen((prev) => !prev)} // 👈 toggle
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          padding: 0,
        }}
      >
        {isOpen ? "✕" : "Chat🤖"} {/* 👈 Cambia el ícono según estado */}
      </Button>
    </>
  );
}

export default Chatbot;
