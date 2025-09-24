import React, { useState, useEffect } from "react";
import { supabase } from "../backend/supabaseClient.js";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Modal from "@mui/material/Modal";

// formatea nombre -> ruta del icono (ej: "Netflix" -> /icons/netflix-icon.webp)
const getIconPath = (nombre) => {
  if (!nombre) return "";
  const formatted = nombre.toLowerCase().replace(/\s+/g, "");
  return `/icons/${formatted}-icon.webp`;
};

// capitaliza la primera letra (para mostrar)
const capitalize = (s = "") =>
  s
    .split(" ")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
    .join(" ");

export const Apps = () => {
  const [apps, setApps] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toggleAddModal, setToggleAddModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formApp, setFormApp] = useState({
    nombre_app: "",
    id_categoria: null,
  });

  // fetch apps (incluye relación categorias para mostrar nombre_cat)
  const fetchApps = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("apps")
      .select(`
        id_app,
        nombre_app,
        id_categoria,
        estado,
        categorias ( id_categoria, nombre_cat )
      `)
      .eq("estado", true)
      .order("id_app", { ascending: false });

    if (error) {
      console.error("Error fetchApps:", error);
      setApps([]);
    } else {
      setApps(data || []);
    }
    setLoading(false);
  };

  // fetch categorias para el select
  const fetchCategorias = async () => {
    const { data, error } = await supabase
      .from("categorias")
      .select("id_categoria, nombre_cat")
      .eq("estado", true)
      .order("id_categoria", { ascending: false });
    if (error) {
      console.error("Error fetchCategorias:", error);
      setCategorias([]);
    } else {
      setCategorias(data || []);
    }
  };

  useEffect(() => {
    fetchCategorias();
    fetchApps();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // id_categoria debe guardarse como número
    if (name === "id_categoria") {
      setFormApp({ ...formApp, [name]: value ? parseInt(value, 10) : null });
    } else {
      setFormApp({ ...formApp, [name]: value });
    }
  };

  const handleOpenAdd = () => {
    setEditId(null);
    setFormApp({ nombre_app: "", id_categoria: null });
    setToggleAddModal(true);
  };

  const handleEdit = (app) => {
    setEditId(app.id_app);
    setFormApp({
      nombre_app: app.nombre_app || "",
      id_categoria: app.id_categoria || null,
    });
    setToggleAddModal(true);
  };

  const handleAddOrUpdate = async (e) => {
    e.preventDefault();

    // validaciones mínimas
    if (!formApp.nombre_app?.trim()) {
      return alert("Ingresa el nombre de la app.");
    }
    if (!formApp.id_categoria) {
      return alert("Selecciona la categoría.");
    }

    // payload: nombre en minúsculas para coincidir con el icono
    const payload = {
      nombre_app: formApp.nombre_app.toLowerCase().trim(),
      id_categoria: formApp.id_categoria,
      estado: true,
    };

    if (editId) {
      const { error } = await supabase
        .from("apps")
        .update(payload)
        .eq("id_app", editId);
      if (error) {
        console.error("Error actualizando app:", error);
        return alert("Error al actualizar. Revisa la consola.");
      }
    } else {
      const { error } = await supabase.from("apps").insert([payload]);
      if (error) {
        console.error("Error insertando app:", error);
        return alert("Error al crear. Revisa la consola.");
      }
    }

    setToggleAddModal(false);
    setEditId(null);
    setFormApp({ nombre_app: "", id_categoria: null });
    fetchApps();
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar app? Esto solo la desactivará.")) return;
    const { error } = await supabase.from("apps").update({ estado: false }).eq("id_app", id);
    if (error) {
      console.error("Error eliminando app:", error);
      alert("No se pudo eliminar. Revisa la consola.");
    } else {
      fetchApps();
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Gestión de Apps</h1>
      <button
        onClick={handleOpenAdd}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-4"
      >
        + Nueva App
      </button>

      <div className="overflow-x-auto mt-2">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Icono</th>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Categoría</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {apps.map((app) => (
              <tr key={app.id_app} className="hover:bg-gray-50 transition text-center items-center ">
                <td className="px-4 py-2 border-b">
                  <img
                    src={getIconPath(app.nombre_app) }
                    alt={app.nombre_app}
                    width="32"
                    height="32"
                    className="mx-auto"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </td>
                <td className="px-4 py-2 border-b">
                  {capitalize(app.nombre_app)}
                </td>
                <td className="px-4 py-2 border-b">
                  {app.categorias?.nombre_cat || "-"}
                </td>
                <td className="px-4 py-2 border-b">
                  <button
                    onClick={() => handleEdit(app)}
                    className="bg-yellow-500 text-white px-2 py-1 rounded text-sm mr-2 hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(app.id_app)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {apps.length === 0 && !loading && (
              <tr>
                <td colSpan="4" className="text-center py-6 text-gray-500">
                  No hay apps registradas.
                </td>
              </tr>
            )}
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

      {/* Modal Añadir / Editar */}
      <Modal open={toggleAddModal} onClose={() => setToggleAddModal(false)}>
        <div className="bg-white p-6 rounded shadow-lg max-w-md mx-auto mt-20">
          <h2 className="text-lg font-bold mb-4">{editId ? "Editar App" : "Nueva App"}</h2>
          <form onSubmit={handleAddOrUpdate} className="space-y-3">
            <label className="block text-sm font-medium">Nombre de la App</label>
            <input
              name="nombre_app"
              value={formApp.nombre_app}
              onChange={handleChange}
              placeholder="Ej: Netflix"
              className="w-full border px-3 py-2 rounded"
              required
            />

            <label className="block text-sm font-medium">Categoría</label>
            <select
              name="id_categoria"
              value={formApp.id_categoria ?? ""}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Seleccionar categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={cat.id_categoria}>
                  {cat.nombre_cat}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => { setToggleAddModal(false); setEditId(null); }}
                className="flex-1 w-full bg-gray-200 py-2 rounded hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Apps;
