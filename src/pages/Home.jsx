import React, { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient.js";
import { useNavigate, Routes, Route } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/nav/Navbar.jsx";
import { Planes } from "./Planes.jsx";
import { Clientes }  from "./Clientes.jsx";

export const Home = () => {

  // ! Estado para almacenar la info del Usuario
  const [user, setUser] = useState(null);
  // ! Importar el hook useNavigate de react-router
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay sesión activa
    const getUser = async () => {
      /* 
      ! Creamos un objeto data y error, esperará la respuesta de supabase
      ! Si hay error o no hay usuario, redirigimos al login
      ? Psdt: !data.user, data obtiene la propiedad user al llamar a auth.getUser()
      */
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        // Si no hay sesión → redirigir al login
        navigate("/");
      } else {
        setUser(data.user);
      }
    };
    // ? Ejecutar la funcion
    getUser();
  }, [navigate]);


  // ! Funcion para cerrar sesión
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="flex bg-slate-100 h-screen">
      <div className="w-1/6">
        <Navbar onLogout={handleLogout} user={user} />
      </div>
      <div className="w-5/6 p-10 overflow-y-auto">
        <Outlet />
      </div>
      
    </div>
  );
};
