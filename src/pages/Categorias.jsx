import { useEffect, useState } from "react";
import { supabase } from "../backend/supabaseClient.js";

export default function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [form, setForm] = useState({ nombre_cat: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔄 Cargar categorías
  const loadCategorias = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categorias")
      .select("*")
      .eq("estado", true)
      .order("id_categoria", { ascending: false });

    if (!error) setCategorias(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategorias();
  }, []);

  // ✏️ Manejar cambios en inputs
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Guardar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      await supabase
        .from("categorias")
        .update({ nombre_cat: form.nombre_cat })
        .eq("id_categoria", editId);
    } else {
      await supabase.from("categorias").insert([{ nombre_cat: form.nombre_cat }]);
    }

    setForm({ nombre_cat: "" });
    setEditId(null);
    loadCategorias();
  };

  // 📝 Editar
  const handleEdit = (cat) => {
    setForm({ nombre_cat: cat.nombre_cat });
    setEditId(cat.id_categoria);
  };

  // 🗑️ Borrado lógico
  const handleDelete = async (id) => {
    await supabase
      .from("categorias")
      .update({ estado: false })
      .eq("id_categoria", id);

    loadCategorias();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Gestión de Categorías</h2>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-x-2 mb-4">
        <input
          type="text"
          name="nombre_cat"
          value={form.nombre_cat}
          placeholder="Nombre de categoría"
          onChange={handleChange}
          required
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {editId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {/* Lista */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul className="space-y-2">
          {categorias.map((c) => (
            <li
              key={c.id_categoria}
              className="flex justify-between items-center bg-white p-2 rounded shadow"
            >
              <span>{c.nombre_cat}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id_categoria)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
