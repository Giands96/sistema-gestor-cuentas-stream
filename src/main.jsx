import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import { Route, Routes } from 'react-router-dom'
import { Login } from './pages/Login.jsx'
import { Home } from './pages/Home.jsx'
import { Planes } from './pages/Planes.jsx'
import { Clientes } from './pages/Clientes.jsx'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
