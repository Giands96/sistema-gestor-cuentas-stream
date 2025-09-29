import React from 'react'
import { BarChart } from '../components/chart/BarChart'

export const Inicio = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <h1 className='text-4xl font-bold'>Bienvenido al Gestor de cuentas streaming</h1>
        <div className='flex gap-40 mt-10'>
          <div className="flex flex-col items-center bg-white p-12 gap-6 rounded-md">
            <div className='w-full'>
                <h2 className='text-xl'>Diagrama de Ventas</h2>
              </div>

            <div className='bg-neutral-100 border-1 border-neutral-300 rounded-xl shadow-md'>
              <div className='w-[400px] min-h-full p-4'>
                <BarChart/>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white p-4">
            <div className='text-left'>
              <h2 className=''>Proximamente</h2>
            </div>
            <div className='bg-gray-500 border'>
              <div className='w-[300px] h-[200px]'>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center bg-white p-4">
            <div className='text-left'>
              <h2 className=''>Proximamente</h2>
            </div>
            <div className='bg-gray-500'>
              <div className='w-[300px] h-[200px]'>
              </div>
            </div>
          </div>
        </div>

    </div>
  )
}

