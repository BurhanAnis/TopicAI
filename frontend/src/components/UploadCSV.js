import React, { useState } from "react";
import { uploadFile } from "../api";

const UploadCSV = ({ setColumns }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      const response = await uploadFile(file);
      setColumns(response.data.columns);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload CSV</button>
    </div>
  );
};

export default UploadCSV;
