import React from "react";
import { Bar } from "react-chartjs-2";

const Visualization = ({ distribution }) => {
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

  return <Bar data={data} />;
};

export default Visualization;
