import React from 'react'
import { supabase } from "../backend/supabaseClient.js";
import { useState, useEffect} from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';

export const Planes = () => {

  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    
    const fetchPlanes = async () => {
      setLoading(true);
      const { data: planesData, error} = await supabase.from('planes').select('*');
      setPlanes(planesData || []);
      setLoading(false);
    };
    fetchPlanes();
  }, [])
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gestión de Planes</h1>
      <p>Aquí podrás ver, agregar y gestionar tus planes.</p>

      <div className="">

        {
          planes.map((plan) => (
            <div key={plan.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
              <h2 className="text-lg font-semibold mb-2">{plan.nombre_app}</h2>
              <p className="text-gray-600 mb-1">Precio: S/ {plan.costo_real}</p>
              <p className="text-gray-600">Precio Venta: S/ {plan.costo_venta}</p>
              <p className="text-gray-600">Ganancia: {plan.ganancia}</p>
              <p className="text-gray-600">Fecha de Vencimiento: {plan.fecha_vencimiento}</p>
              <p className="text-gray-600">Disponible?: 
                { plan.estado ? <span className="text-green-500 font-semibold"> Sí</span> : <span className="text-red-500 font-semibold"> No</span>}</p>

            </div>
          ))
        }
        
          
        {loading && (
        <div className="flex justify-center items-center mt-4">
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
          </Box>
        </div>
      )}
      </div>
    </div>
  )
}
