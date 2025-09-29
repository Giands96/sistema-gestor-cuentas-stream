import React, { useEffect, useState } from "react";
import { supabase } from "../../backend/supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export const BarChart = () => {
  const [chartData, setChartData] = useState(null);
  const añoActual = new Date().getFullYear();

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("cuentas")
        .select("fecha_inicio")
        .gte("fecha_inicio", `${añoActual}-01-01`)
        .lte("fecha_inicio", `${añoActual}-12-31`);

      if (error) {
        console.error(error);
        return;
      }

      // Contador de meses (12 posiciones inicializadas en 0)
      const cuentasPorMes = Array(12).fill(0);

      data.forEach((cuenta) => {
        const mes = new Date(cuenta.fecha_inicio).getMonth(); // 0 = Enero
        cuentasPorMes[mes] += 1;
      });

      setChartData({
        labels: [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ],
        datasets: [
          {
            label: `Cuentas ${añoActual}`,
            data: cuentasPorMes,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    };

    fetchData();
  }, [añoActual]);

  const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Reporte de ventas",
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 10,  // intervalo de 10 en 10
      },
      suggestedMax: 50, // altura máxima sugerida (ajústalo según tu caso)
    },
  },
};


  return chartData ? <Bar options={options} data={chartData} /> : <p>Cargando...</p>;
};
