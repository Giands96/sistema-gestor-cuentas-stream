import { useState, useEffect } from "react";
import { supabase } from "../backend/supabaseClient.js";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export const Prices = () => {
  const [loading, setLoading] = useState(true);
  const [precios, setPrecios] = useState([]);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    const fetchPrecios = async () => {
      setLoading(true);
      const { data: preciosData, error: preciosError } = await supabase.from("precios").select("*");
      const { data: appsData, error: appsError } = await supabase.from("apps").select("*");

      if (preciosError) {
        console.error("Error al obtener precios:", preciosError.message);
        setPrecios([]);
      } else {
        setPrecios(preciosData || []);
      }

      if (appsError) {
        console.error("Error al obtener apps:", appsError.message);
        setApps([]);
      } else {
        setApps(appsData || []);
      }

      setLoading(false);

      if (!preciosData || preciosData.length === 0) {
        console.log("No se encontraron precios.",preciosData);
      }
    };
    fetchPrecios();
  }, []);

  return (
    <div>
      <h1 className="text-4xl font-bold text-center">Lista de Precios</h1>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <Box sx={{ display: "flex" }}>
            <CircularProgress />
          </Box>
        </div>
      ) : (
        <div className="overflow-x-auto mt-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-center border-b-2 border-gray-300">
                <th className="p-2">ID Precio</th>
                <th className="p-2">Nombre APP</th>
                <th className="p-2">Precio Costo</th>
                <th className="p-2">Precio Venta</th>
                <th className="p-2">Ganancia</th>
              </tr>
            </thead>
            <tbody>
              {precios.map((precio) => {
                const app = apps.find((a) => a.id === precio.id_app);
                return (
                  <tr
                    key={precio.id}
                    className="text-center border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="p-2">{precio.id}</td>
                    <td className="p-2">{app ? app.nombre_app : "Desconocido"}</td>
                    <td className="p-2">{precio.precio_costo}</td>
                    <td className="p-2">{precio.precio_venta}</td>
                    <td className="p-2">{precio.ganancia}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
