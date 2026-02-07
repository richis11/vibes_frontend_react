import React from 'react'
import logo from "../assets/vibes.png";

function Inicio_page() {
  return (
    <>
    <img
        src={logo}
        alt="Logo del chat"
        style={{ width: "75%", height: "75%", borderRadius: "50%" }}
      />
    </>
  )
}

export default Inicio_page