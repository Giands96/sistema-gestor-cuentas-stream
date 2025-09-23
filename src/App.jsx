import { useState } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import reactLogo from './assets/react.svg'
import { Home } from './pages/Home'
import viteLogo from '/vite.svg'
import { Login } from './pages/Login'
import './App.css'
import Button from '@mui/material/Button';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      
      <Login/>

    </>
  )
}

export default App
