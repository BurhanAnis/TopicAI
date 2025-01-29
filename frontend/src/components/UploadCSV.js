import React, { useState } from "react";
import { uploadFile } from "../api";

const UploadCSV = ({ setColumns, setFile }) => {  // Accept setFile prop to store the file globally
  const [selectedFile, setSelectedFile] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  // Upload file and retrieve columns
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }
    
    try {
      const response = await uploadFile(selectedFile);
      setColumns(response.data.columns);
      setFile(selectedFile); // Store the file globally
      console.log("✅ File uploaded successfully:", selectedFile.name);
    } catch (error) {
      console.error("❌ Error uploading file:", error);
    }
  };

  return (
    <div className="upload-container">
      <input type="file" onChange={handleFileChange} className="file-input"/>
      <button className="btn" onClick={handleUpload}>Upload CSV</button>
    </div>
  );
  
};

export default UploadCSV;

