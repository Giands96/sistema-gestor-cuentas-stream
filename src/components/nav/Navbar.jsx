import React from 'react'
import { NavLink } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount';
import LogoutIcon from '@mui/icons-material/Logout';
import CastIcon from '@mui/icons-material/Cast';
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay';
import CategoryIcon from '@mui/icons-material/Category';


export const Navbar = ({ onLogout, user}) => {
  return (
    <div className="container h-[100dvh] bg-white text-neutral-800 p-4 justify-center items-center text-center">
        <div className="my-10">
            <h2 className="text-2xl font-semibold font-displa">
                Gestor de Cuentas
            </h2>
            <div className="text-xs text-gray-500">{user?.email}</div>
        </div>
        <div className='container flex flex-col text-left'>
            <ul className="mt-10 space-y-6">
                <li >
                  <NavLink to="/home" 
                  className="hover:bg-blue-50/80 p-3 rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm font-semibold"><HomeIcon/>Inicio</NavLink>
                </li>
                <li>
                  <NavLink to="/home/planes" 
                  className={({isActive}) => isActive ? "bg-blue-50/80 p-3 rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm font-semibold" : "hover:bg-blue-50/80 p-3 rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm"}><SmartDisplayIcon/>Planes</NavLink>
                </li>
                <li>
                  <NavLink to="/home/clientes" 
                  className={({isActive}) => isActive ? "bg-blue-50/80 p-3 font-semibold rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm" : "hover:bg-blue-50/80 p-3 rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm"}><SwitchAccountIcon/>Clientes</NavLink>
                </li>
                <li>
                  <NavLink to="/home/apps" 
                  className={({isActive}) => isActive ? "bg-blue-50/80 p-3 font-semibold rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm" : "hover:bg-blue-50/80 p-3 rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm"}><CastIcon/>Apps</NavLink>
                </li>
                <li>
                  <NavLink to="/home/categorias" 
                  className={({isActive}) => isActive ? "bg-blue-50/80 p-3 font-semibold rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm" : "hover:bg-blue-50/80 p-3 rounded-lg cursor-pointer flex gap-2 border-1 border-neutral-200 transition-colors shadow-sm"}><CategoryIcon/>Categorias</NavLink>
                </li>
                <li>
                    <button onClick={onLogout} className="cursor-pointer w-full text-sm text-white bg-red-600 border-1 rounded-lg border-red-400 hover:bg-red-800 transition-colors p-3 mt-4 gap-2"> <LogoutIcon/> Cerrar sesión</button>
                </li>
            </ul>
        </div>
        <div className='relative bottom-0 mt-20 text-sm text-gray-400'>
            <span>v1.0</span>
        </div>
    </div>
  )
}
