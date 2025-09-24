// Clientes.jsx
import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient.js";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";

// Modal
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-[50vw]">
        {children}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [toggleAñadir, setToggleAñadir] = useState(false);
  const [toggleEditar, setToggleEditar] = useState(false);
  const [toggleDeshabilitar, setToggleDeshabilitar] = useState(false);

  // Form states
  const [formCliente, setFormCliente] = useState({
    numero_celular: "",
    nombre: "",
    descripcion: "",
  });
  const [clienteEditar, setClienteEditar] = useState(null);
  const [clienteDeshabilitar, setClienteDeshabilitar] = useState(null);

  // Cargar clientes
  useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("clientes").select("*");
      if (!error) setClientes(data);
      setLoading(false);
    };
    fetchClientes();
  }, []);

  // Handlers
  const handleChange = (e) => {
    setFormCliente({ ...formCliente, [e.target.name]: e.target.value });
  };

  const handleAddCliente = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("clientes").insert([formCliente]);
    if (!error) {
      setToggleAñadir(false);
      setFormCliente({ numero_celular: "", nombre: "", descripcion: "" });
      const { data } = await supabase.from("clientes").select("*");
      setClientes(data);
    }
  };

  const handleEditCliente = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("clientes")
      .update(formCliente)
      .eq("id_cliente", clienteEditar.id_cliente);

    if (!error) {
      setToggleEditar(false);
      setClienteEditar(null);
      const { data } = await supabase.from("clientes").select("*");
      setClientes(data);
    }
  };

  const handleDeshabilitarCliente = async () => {
    if (!clienteDeshabilitar) return;
    const nuevoEstado = !clienteDeshabilitar.activo;
    await supabase
      .from("clientes")
      .update({ activo: nuevoEstado })
      .eq("id_cliente", clienteDeshabilitar.id_cliente);

    setToggleDeshabilitar(false);
    setClienteDeshabilitar(null);
    const { data } = await supabase.from("clientes").select("*");
    setClientes(data);
  };

  // Abrir modal editar
  const openEditar = (cliente) => {
    setClienteEditar(cliente);
    setFormCliente({
      numero_celular: cliente.numero_celular || "",
      nombre: cliente.nombre || "",
      descripcion: cliente.descripcion || "",
    });
    setToggleEditar(true);
  };

  const openDeshabilitar = (cliente) => {
    setClienteDeshabilitar(cliente);
    setToggleDeshabilitar(true);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Clientes</h2>

      <button
        onClick={() => setToggleAñadir(true)}
        className="flex items-center bg-white border px-4 py-1 rounded-md shadow hover:bg-gray-50 mb-4"
      >
        <AddIcon /> <span> Agregar Cliente</span>
      </button>

      {/* Tabla */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Número Celular</th>
              <th className="px-6 py-3">Nombre</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4">
                  No hay clientes disponibles
                </td>
              </tr>
            ) : (
              clientes.map((c) => (
                <tr key={c.id_cliente} className="bg-white border-b">
                  <td className="px-6 py-4">{c.id_cliente}</td>
                  <td className="px-6 py-4">{c.numero_celular}</td>
                  <td className="px-6 py-4">{c.nombre}</td>
                  <td className="px-6 py-4">{c.descripcion}</td>
                  <td className="px-6 py-4">
                    {c.activo ? "Activo" : "Inactivo"}
                  </td>
                  <td className="px-6 py-4 text-right flex gap-3 justify-end">
                    <button
                      onClick={() => openEditar(c)}
                      className="text-blue-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeshabilitar(c)}
                      className={`${
                        c.activo
                          ? "text-red-600 hover:underline"
                          : "text-green-600 hover:underline"
                      }`}
                    >
                      {c.activo ? "Deshabilitar" : "Habilitar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="flex justify-center mt-4">
          <Box>
            <CircularProgress />
          </Box>
        </div>
      )}

      {/* Modal Añadir */}
      <Modal open={toggleAñadir} onClose={() => setToggleAñadir(false)}>
        <form onSubmit={handleAddCliente} className="space-y-3">
          <input
            name="numero_celular"
            value={formCliente.numero_celular}
            onChange={handleChange}
            placeholder="Número Celular"
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="nombre"
            value={formCliente.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="descripcion"
            value={formCliente.descripcion}
            onChange={handleChange}
            placeholder="Descripción"
            className="w-full border px-3 py-2 rounded"
          />
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
        <form onSubmit={handleEditCliente} className="space-y-3">
          <input
            name="numero_celular"
            value={formCliente.numero_celular}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="nombre"
            value={formCliente.nombre}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="descripcion"
            value={formCliente.descripcion}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Guardar cambios
          </button>
        </form>
      </Modal>

      {/* Modal Deshabilitar */}
      <Modal open={toggleDeshabilitar} onClose={() => setToggleDeshabilitar(false)}>
        <h3 className="text-lg font-bold mb-4">
          {clienteDeshabilitar?.activo ? "Deshabilitar" : "Habilitar"} Cliente
        </h3>
        <p>
          ¿Estás seguro de {clienteDeshabilitar?.activo ? "deshabilitar" : "habilitar"} a{" "}
          {clienteDeshabilitar?.numero_celular}?
        </p>
        <div className="flex gap-2 mt-4 ">
          <button
            onClick={handleDeshabilitarCliente}
            className={`px-4 py-2 rounded ${
              clienteDeshabilitar?.activo
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            Sí
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
