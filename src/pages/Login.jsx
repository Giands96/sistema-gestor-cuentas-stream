import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import loginImage from '../assets/loginImage.jpg'
import Button from '@mui/material/Button';
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { createClient } from '@supabase/supabase-js';



export const Login = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASEURL;
  const supabaseKey = import.meta.env.VITE_SUPABASEKEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      console.log('Error al iniciar sesión:', error.message);
    } else {
      console.log('Inicio de sesión exitoso.', data);
      setError(null);
      // Aquí puedes redirigir al usuario a otra página o actualizar el estado de la aplicación
      navigate('/home');
    }

  }



  return (

    
    <div className="flex items-center justify-center min-h-screen  bg-darkpurple text-gray-200 p-4">
      <div className="flex max-w-4xl w-full h-[600px] mx-auto bg-form rounded-2xl  shadow-black/30 shadow-lg overflow-hidden">
        {/* Left side with image and text */}
        <div className="hidden md:flex md:w-1/2 bg-cover bg-center rounded-l-2xl p-8 flex-col justify-between"
             style={{ backgroundImage: `url(${loginImage})` }}>
          <div className="text-white text-lg font-bold">
            <span className="text-2xl font-bold font-display ">DStreaming</span>
          </div>
          <div className="text-center text-white">
            <h2 className="text-3xl font-light">Sistema Gestión de Streaming</h2>
          </div>
          <div className="flex justify-center mt-4">
            <div className="w-2 h-2 mx-1 bg-gray-300 rounded-full"></div>
            <div className="w-2 h-2 mx-1 bg-gray-500 rounded-full"></div>
            <div className="w-2 h-2 mx-1 bg-gray-500 rounded-full"></div>
          </div>
        </div>

        {/* Right side with login form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12">
          <div className="mb-8 text-center  font-display">
            
            <h2 className="text-4xl mt-2">Iniciar Sesión</h2>
            
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-400">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                placeholder="Ingresa tu correo electrónico"
                className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-400">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                />
                
                <button type="button" onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none'>
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>

              </div>
            </div>

            {error && <p className="text-red-500">{error}</p>}
            <div className='flex justify-center items-center'>
              <Button type="submit" variant="outlined" sx={{
                color: '#9c27b0',
                borderColor: '#9c27b0',
                '&:hover': { borderColor: '#9c27b0' },
                width: '50%',
                fontSize: '16px',
                textTransform: 'none',
              }}>Iniciar Sesión</Button>
            </div>
            
          </form>

          <div className="flex items-center my-6 cursor-none">
            <hr className="flex-grow border-gray-600" />
            <span className="px-4 text-sm text-gray-400">Versión 1.0</span>
            <hr className="flex-grow border-gray-600" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
           
          </div>
        </div>
      </div>

           
              
    </div>
  )
}
