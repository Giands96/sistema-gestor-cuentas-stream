import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient.js";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

// Modal simple
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[50vw]">
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

export const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [toggleAñadir, setToggleAñadir] = useState(false);
  const [toggleEditar, setToggleEditar] = useState(false);
  const [toggleDeshabilitar, setToggleDeshabilitar] = useState(false);

  // Form states
  const [formCliente, setFormCliente] = useState({
    numero_celular: "",
    nombre_app: "",
    correo_plan: "",
    costo_venta: "",
    fecha_vencimiento: "",
    plan_id: "",
  });
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteDeshabilitar, setClienteDeshabilitar] = useState(null);

  // Cargar clientes y planes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const { data: clientesData } = await supabase.from("clientes_detalle").select("*");
      // Solo traer planes activos (ajusta el campo según tu base de datos, por ejemplo: estado o activo)
      const { data: planesData } = await supabase
        .from("planes").select("id, nombre_app, estado")
        .eq("estado", true); // Cambia "estado" por el campo real si es diferente
      setClientes(clientesData || []);
      setPlanes(planesData || []);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Handlers para formularios
  const handleChange = (e) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
  };

  const handleAddCliente = async (e) => {
    e.preventDefault();

  const { error } = await supabase.from("clientes").insert([
    {
      
      numero_celular: formCliente.numero_celular,
      plan_id: formCliente.plan_id,
      activo: true,
    },
  ]);

  if (!error) {
    setToggleAñadir(false);
    setFormCliente({
      numero_celular: "",
      plan_id: "",
    });

    // Recargar clientes desde la vista
    const { data: clientesData } = await supabase
      .from("clientes_detalle")
      .select("*");

    setClientes(clientesData || []);
  } else {
    console.log("Error al agregar cliente:", error.message);
  }
  };

  const handleEditCliente = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("clientes")
      .update({
        numero_celular: formCliente.numero_celular,
        plan_id: formCliente.plan_id,
        activo: formCliente.activo === true || formCliente.activo === "true",
        nombre_app: formCliente.nombre_app,
        correo_plan: formCliente.correo_plan,
        costo_venta: formCliente.costo_venta,
        fecha_vencimiento: formCliente.fecha_vencimiento,
      })
      .eq("id", clienteEditar.cliente_id);

    if (!error) {
      setToggleEditar(false);
      setClienteEditar(null);
      const { data: clientesData } = await supabase
        .from("clientes_detalle")
        .select("*");
      setClientes(clientesData || []);
    }
  };

  const handleDeshabilitarCliente = async () => {
    if (!clienteDeshabilitar) return;
    // Alternar el estado
    const nuevoEstado = !clienteDeshabilitar.activo;
    const { error } = await supabase
      .from("clientes")
      .update({ activo: nuevoEstado })
      .eq("id", clienteDeshabilitar.cliente_id);

    if (!error) {
      setToggleDeshabilitar(false);
      setClienteDeshabilitar(null);
      const { data: clientesData } = await supabase
        .from("clientes_detalle")
        .select("*");
      setClientes(clientesData || []);
    }
  };

  // Abrir modal editar
  const openEditar = (cliente) => {
    setClienteEditar(cliente);
    setFormCliente({
      numero_celular: cliente.numero_celular || "",
      nombre_app: cliente.nombre_app || "",
      correo_plan: cliente.correo_plan || "",
      costo_venta: cliente.costo_venta || "",
      fecha_vencimiento: cliente.fecha_vencimiento || "",
      plan_id: cliente.plan_id || "",
      activo: cliente.activo,
    });
    setToggleEditar(true);
  };

  // Abrir modal deshabilitar
  const openDeshabilitar = (cliente) => {
    setClienteDeshabilitar(cliente);
    setToggleDeshabilitar(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>
      <div>
        <button
          className="flex items-center bg-white border border-gray-300 text-gray-700 px-4 py-1 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4 transition-colors cursor-pointer"
          onClick={() => setToggleAñadir(true)}
        >
          <AddIcon />
          <span> Agregar Cliente</span>
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50  ">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Número Celular
              </th>
              <th scope="col" className="px-6 py-3">
                Aplicación
              </th>
              <th scope="col" className="px-6 py-3">
                Correo Plan
              </th>
              <th scope="col" className="px-6 py-3">
                Precio
              </th>
              <th scope="col" className="px-6 py-3">
                Vence
              </th>
              <th scope="col" className="px-6 py-3">
                Estado
              </th>
              <th scope="col" className="px-6 py-3 text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No hay clientes disponibles.
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr
                  key={c.cliente_id}
                  className="bg-white border-b  border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap "
                  >
                    {c.cliente_id}
                  </th>
                  <td className="px-6 py-4">{c.numero_celular}</td>
                  <td className="px-6 py-4">{c.nombre_app}</td>
                  <td className="px-6 py-4">{c.correo_plan}</td>
                  <td className="px-6 py-4">S/ {c.costo_venta}</td>

                  <td className="px-6 py-4">
                    {c.fecha_vencimiento ? (
                      c.fecha_vencimiento
                    ) : (
                      <span className="italic text-gray-400">
                        Sin fecha de Vencimiento
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {c.activo ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-4 justify-end ">
                    <button
                      className={`font-medium ${c.activo ? "dark:text-red-600" : "dark:text-green-600"} dark:text-blue-500 hover:underline`}
                      onClick={() => openDeshabilitar(c)}
                    >
                      {c.activo ? "Deshabilitar" : "Habilitar"}
                    </button>
                    <button
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                      onClick={() => openEditar(c)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {loading && (
        <div className="flex justify-center items-center mt-4">
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      )}

      {/* Modal Añadir */}
      <Modal
        className=""
        open={toggleAñadir}
        onClose={() => setToggleAñadir(false)}
      >
        <form onSubmit={handleAddCliente} className="space-y-3">
          <label htmlFor="numero_celular">Número de Celular</label>
          <input
            name="numero_celular"
            value={formCliente.numero_celular}
            onChange={handleChange}
            placeholder="Número Celular"
            className="w-full border px-3 py-2 rounded"
            required
          />

          <label htmlFor="plan_id">Selecciona un Plan</label>
          <select
            name="plan_id"
            value={formCliente.plan_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          >
            <option value="">Selecciona un plan</option>
            {planes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre_app}
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
      </Modal>

      {/* Modal Editar */}
      <Modal open={toggleEditar} onClose={() => setToggleEditar(false)}>
        <h3 className="text-lg font-bold mb-4">Editar Cliente</h3>
        <form onSubmit={handleEditCliente} className="space-y-3">
          <input
            name="numero_celular"
            value={formCliente.numero_celular}
            onChange={handleChange}
            placeholder="Número Celular"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="nombre_app"
            value={formCliente.nombre_app}
            onChange={handleChange}
            placeholder="Aplicación"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="correo_plan"
            value={formCliente.correo_plan}
            onChange={handleChange}
            placeholder="Correo Plan"
            className="w-full border px-3 py-2 rounded"
          />
          <input
            name="costo_venta"
            value={formCliente.costo_venta}
            onChange={handleChange}
            placeholder="Precio"
            className="w-full border px-3 py-2 rounded"
            type="number"
            min="0"
          />
          <select
            name="plan_id"
            value={formCliente.plan_id}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Selecciona un plan</option>
            {planes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>

          

          <input
            name="fecha_vencimiento"
            value={formCliente.fecha_vencimiento}
            onChange={handleChange}
            placeholder="Fecha de Vencimiento"
            className="w-full border px-3 py-2 rounded"
            type="date"
          />
          <button
            type="submit"
            className="cursor-pointer w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Guardar Cambios
          </button>
        </form>
      </Modal>

      {/* Modal Deshabilitar */}
      <Modal open={toggleDeshabilitar} onClose={() => setToggleDeshabilitar(false)}>
        <h3 className="text-lg font-bold mb-4">
          {clienteDeshabilitar?.activo ? "Deshabilitar" : "Habilitar"} Cliente
        </h3>
        <p>
          ¿Estás seguro que deseas {clienteDeshabilitar?.activo ? "deshabilitar" : "habilitar"} al cliente{" "}
          <span className="font-semibold">
            {clienteDeshabilitar?.numero_celular}
          </span>
          ?
        </p>
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleDeshabilitarCliente}
            className={`px-4 py-2 rounded ${clienteDeshabilitar?.activo ? "bg-red-600 text-white hover:bg-red-700" : "bg-green-600 text-white hover:bg-green-700"}`}
          >
            Sí, {clienteDeshabilitar?.activo ? "deshabilitar" : "habilitar"}
          </button>
          <button
            onClick={() => setToggleDeshabilitar(false)}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      </Modal>
    </div>
  );
};