import React from "react";
import { useState, useRef, useEffect } from "react";
import { Card, Form, Button, InputGroup, Badge } from "react-bootstrap";

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatBodyRef = useRef(null); // Para hacer scroll automático

  const handleSend = async () => {
    if (!input.trim()) return;

    // Agregar mensaje del usuario
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const userInput = input;
    setInput("");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });

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

  // Scroll automático cuando llegan mensajes nuevos
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      <h3>CHATBOT</h3>

      <Card style={{ height: "500px" }}>
        {/* Cuerpo del chat con scroll */}
        <Card.Body
          ref={chatBodyRef}
          style={{
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.sender === "user" ? "#0d6efd" : "#d4d4d4",
                color: msg.sender === "user" ? "white" : "black",
                padding: "8px 12px",
                borderRadius: "15px",
                marginBottom: "8px",
                maxWidth: "70%",
              }}
            >
              {msg.text}
            </div>
          ))}
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
                type="text"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <Button variant="primary" onClick={handleSend} className="ms-2">
                Enviar
              </Button>
            </div>
          </Form>
        </Card.Footer>
      </Card>
    </>
  );
}

export default Chatbot;
