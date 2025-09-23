import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import { Home } from './pages/Home'
import viteLogo from '/vite.svg'
import { Login } from './pages/Login'
import './App.css'
import { Planes } from './pages/Planes'
import { Clientes }  from './pages/Clientes'
import Button from '@mui/material/Button';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<Login />} />

      {/* Dashboard */}
      <Route path="/home" element={<Home />}>
        <Route path="clientes" element={<Clientes />} />
        <Route path="planes" element={<Planes />} />
      </Route>
    </Routes>
  )
}

export default App
