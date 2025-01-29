import React, { useState } from "react";
import UploadCSV from "./components/UploadCSV";
import TopicModeling from "./components/TopicModeling";
import LabelTopics from "./components/LabelTopics";
import Categorization from "./components/Categorization";
import Visualization from "./components/Visualization";
import { getTopicDistribution } from "./api";

const App = () => {
  const [file, setFile] = useState(null);  // Store uploaded file
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [topics, setTopics] = useState({});
  const [topicLabels, setTopicLabels] = useState({})
  const [categorizedData, setCategorizedData] = useState([]);
  const [distribution, setDistribution] = useState({});

  const fetchTopicDistribution = async () => {
    if (!file || !selectedColumn) {
      alert("Please upload a file and select a column first.");
      return;
    }
    try {
      const response = await getTopicDistribution(file, selectedColumn);
      setDistribution(response.data.distribution);
    } catch (error) {
      console.error("Error fetching topic distribution:", error);
    }
  };

  return (
    <div>
      <h1>Topic Modeling App</h1>
      
      {/* File Upload */}
      <UploadCSV setColumns={setColumns} setFile={setFile} />

      {/* Column Selection */}
      {columns.length > 0 && (
        <select onChange={(e) => setSelectedColumn(e.target.value)}>
          <option value="">Select Column</option>
          {columns.map((col) => (
            <option key={col} value={col}>{col}</option>
          ))}
        </select>
      )}

      {/* Topic Modeling */}
      {file && selectedColumn && (
        <TopicModeling file={file} column={selectedColumn} setTopics={setTopics} />
      )}

      {/* Labeling Topics */}
      {Object.keys(topics).length > 0 && (
        <LabelTopics topics={topics} setTopicLabels={setTopicLabels}/>
      )}

      {/* Categorization */}
      {file && selectedColumn && (
        <Categorization file={file} column={selectedColumn} setCategorizedData={setCategorizedData} />
      )}

      {/* Get Topic Distribution */}
      <button onClick={fetchTopicDistribution}>Get Topic Distribution</button>

      {/* Visualization */}
      {Object.keys(distribution).length > 0 && <Visualization distribution={distribution} />}
    </div>
  );
};

export default App;


