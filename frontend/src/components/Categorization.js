import React, { useState } from "react";
import { categorizeResponses } from "../api";

const Categorization = ({ file, column, setCategorizedData }) => {
  const fetchCategorizedData = async () => {
    const response = await categorizeResponses(file, column);
    setCategorizedData(response.data.data);
  };

  return (
    <div className="categorization-container">
      <button className="btn" onClick={fetchCategorizedData}>Categorize Responses</button>
    </div>
  );
  
};

export default Categorization;
