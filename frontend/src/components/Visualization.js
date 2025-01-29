import React, { useEffect, useRef } from "react";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Visualization = ({ distribution }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    return () => {
      // ✅ Destroy the chart when component unmounts
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [distribution]);

  const data = {
    labels: Object.keys(distribution),
    datasets: [
      {
        label: "Responses per Topic",
        data: Object.values(distribution),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <Bar ref={chartRef} data={data} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  );
  
};

export default Visualization;
