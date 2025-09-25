import React, { useState, useEffect } from "react";
import { supabase } from "../backend/supabaseClient.js";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";

export const Planes = () => {
  const [cuentas, setCuentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [apps, setApps] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toggleAddModal, setToggleAddModal] = useState(false);

  const [formCuenta, setFormCuenta] = useState({
    correo: "",
    contraseña: "",
    tiempo: "",
    fecha_inicio: "",
    fecha_vencimiento: "",
    activo: true,
    id_cliente: null,
    id_app: null,
    id_categoria: null,
  });

  // Cargar cuentas y relaciones
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: cuentasData } = await supabase.from("cuentas").select(`
        id_cuenta,
        correo,
        contraseña,
        tiempo,
        fecha_inicio,
        fecha_vencimiento,
        activo,
        clientes ( id_cliente, numero_celular, nombre ),
        apps ( id_app, nombre_app ),
        categorias ( id_categoria, nombre_cat )
      `);

      const { data: clientesData } = await supabase.from("clientes").select("*");
      const { data: appsData } = await supabase.from("apps").select("*");
      const { data: categoriasData } = await supabase.from("categorias").select("*");

      setCuentas(cuentasData || []);
      setClientes(clientesData || []);
      setApps(appsData || []);
      setCategorias(categoriasData || []);
      setLoading(false);
      
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormCuenta({ ...formCuenta, [e.target.name]: e.target.value });
  };

  const handleAddCuenta = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("cuentas").insert([formCuenta]);
    if (!error) {
      setToggleAddModal(false);
      setFormCuenta({
        correo: "",
        contraseña: "",
        tiempo: "",
        fecha_inicio: "",
        fecha_vencimiento: "",
        activo: true,
        id_cliente: null,
        id_app: null,
        id_categoria: null,
      });

      // refrescar lista
      const { data } = await supabase.from("cuentas").select(`
        id_cuenta,
        correo,
        contraseña,
        tiempo,
        fecha_inicio,
        fecha_vencimiento,
        activo,
        clientes ( id_cliente, numero_celular ),
        apps ( id_app, nombre_app ),
        categorias ( id_categoria, nombre_cat )
      `);
      setCuentas(data || []);
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gestión de Cuentas</h1>
      <button
        onClick={() => setToggleAddModal(true)}
        className="bg-indigo-600 text-white px-4 py-2 rounded"
      >
        + Nueva Cuenta
      </button>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">App</th>
              <th className="px-4 py-2 border-b">Categoría</th>
              <th className="px-4 py-2 border-b">Cliente</th>
              <th className="px-4 py-2 border-b">Correo</th>
              <th className="px-4 py-2 border-b">Contraseña</th>
              <th className="px-4 py-2 border-b">Tiempo de Duracion</th>
              <th className="px-4 py-2 border-b">Inicio</th>
              <th className="px-4 py-2 border-b">Vencimiento</th>
              <th className="px-4 py-2 border-b">Estado</th>
            </tr>
          </thead>
          <tbody>
            {cuentas.map((cuenta) => (
              <tr key={cuenta.id_cuenta} className="hover:bg-gray-50 transition text-center">
                <td className="px-4 py-2 border-b">{cuenta.apps?.nombre_app}</td>
                <td className="px-4 py-2 border-b">{cuenta.categorias?.nombre_cat}</td>
                <td className="px-4 py-2 border-b">{cuenta.clientes?.numero_celular} - {cuenta.clientes?.nombre}</td>
                <td className="px-4 py-2 border-b">{cuenta.correo}</td>
                <td className="px-4 py-2 border-b">{cuenta.contraseña}</td>
                <td className="px-4 py-2 border-b">
                  {cuenta.tiempo} - (
                  {(() => {
                    const hoy = new Date();
                    const vencimiento = new Date(cuenta.fecha_vencimiento);
                    const diffTime = vencimiento - hoy;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return isNaN(diffDays) ? "N/A" : `${diffDays} días restantes`;
                  })()}
                  )
                </td>
                <td className="px-4 py-2 border-b">{cuenta.fecha_inicio}</td>
                <td className="px-4 py-2 border-b">{cuenta.fecha_vencimiento}</td>
                <td className="px-4 py-2 border-b">
                  {cuenta.activo ? (
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                      Activo
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">
                      Inactivo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && (
          <div className="flex justify-center items-center mt-4">
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          </div>
        )}
      </div>

      

      {/* Modal Añadir Cuenta */}
      <Modal open={toggleAddModal} onClose={() => setToggleAddModal(false)}>
        <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20">
          <h2 className="text-lg font-bold mb-4">Nueva Cuenta</h2>
          <form onSubmit={handleAddCuenta} className="space-y-3">
            <label htmlFor="correo" className="relative bg-white top-3 left-1 px-1  z-2">Correo electronico</label>
            <input
              name="correo"
              value={formCuenta.correo}
              onChange={handleChange}
              placeholder=""
              className="w-full border px-2 py-2 rounded relative"
              required
            />
            <label htmlFor="contraseña" className="relative bg-white top-3 left-1 px-1  z-2">Contraseña</label>
            <input
              name="contraseña"
              value={formCuenta.contraseña}
              onChange={handleChange}
              placeholder=""
              className="w-full border px-3 py-2 rounded"
              required
            />
            <label htmlFor="tiempo" className="relative bg-white top-3 left-1 px-1  z-2">Tiempo de Duracion</label>
            <input
              name="tiempo"
              value={formCuenta.tiempo}
              onChange={handleChange}
              placeholder="(ej: 1 mes , 3 meses, 6 meses, 1 año)"
              className="w-full border px-3 py-2 rounded"
            />
            <label htmlFor="fecha_inicio" className="relative bg-white top-3 left-1 px-1  z-2">Fecha de Inicio</label>
            <input
              type="date"
              name="fecha_inicio"
              value={formCuenta.fecha_inicio}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />
            <label htmlFor="fecha_vencimiento" className="relative bg-white top-3 left-1 px-1  z-2">Fecha de Vencimiento</label>
            <input
              type="date"
              name="fecha_vencimiento"
              value={formCuenta.fecha_vencimiento}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            />

            {/* Selects dinámicos */}
            <label htmlFor="id_cliente" className="relative bg-white top-3 left-1 px-1  z-2">Cliente</label>
            <select
              name="id_cliente"
              value={formCuenta.id_cliente || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccionar Cliente</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.numero_celular} - {c.nombre}
                </option>
              ))}
            </select>
            <label htmlFor="id_app" className="relative bg-white top-3 left-1 px-1  z-2">App</label>
            <select
              name="id_app"
              value={formCuenta.id_app || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccionar App</option>
              {apps.map((a) => (
                <option key={a.id_app} value={a.id_app}>
                  {a.nombre_app}
                </option>
              ))}
            </select>
              <label htmlFor="id_categoria" className="relative bg-white top-3 left-1 px-1  z-2">Categoria</label>
            <select
              name="id_categoria"
              value={formCuenta.id_categoria || ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccionar Categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_cat}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Guardar
            </button>
          </form>
        </div>
      </Modal>
    </div>
  );
};
