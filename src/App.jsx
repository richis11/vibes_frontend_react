import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Chatbot from './components/Chatbot'
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './assets/vibes.png'

function App() {


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      {/* <h1>Vibes</h1> */}

      <img
        src={logo}
        alt="Logo del chat"
        style={{ width: "75%", height: "75%", borderRadius: "50%" }}
      />
      
      

      <Chatbot></Chatbot>
    </>
  )
}

export default App
