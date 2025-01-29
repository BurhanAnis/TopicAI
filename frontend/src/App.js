import React, { useState } from "react";
import UploadCSV from "./components/UploadCSV";
import TopicModeling from "./components/TopicModeling";
import LabelTopics from "./components/LabelTopics";
import Categorization from "./components/Categorization";
import Visualization from "./components/Visualization";
import { getTopicDistribution } from "./api";
import "./App.css"; // Ensure styles are applied

const App = () => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [topics, setTopics] = useState({});
  const [topicLabels, setTopicLabels] = useState({});
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
    <div className="dashboard-container">
      {/* Sidebar - Upload and Column Selection */}
      <div className="sidebar">
        <h2>Upload CSV</h2>
        <UploadCSV setColumns={setColumns} setFile={setFile} />

        {columns.length > 0 && (
          <div className="column-selection">
            <h3>Select Column</h3>
            <select onChange={(e) => setSelectedColumn(e.target.value)}>
              <option value="">Select Column</option>
              {columns.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <h1>Topic Modeling App</h1>

        {/* Topic Modeling Section */}
        {file && selectedColumn && (
          <div className="section">
            <h2>Topic Modeling</h2>
            <TopicModeling file={file} column={selectedColumn} setTopics={setTopics} />
          </div>
        )}

        {/* Label Topics Section */}
        {Object.keys(topics).length > 0 && (
          <div className="section">
            <h2>Label Topics</h2>
            <LabelTopics topics={topics} setTopicLabels={setTopicLabels} />
          </div>
        )}

        {/* Categorization Section */}
        {file && selectedColumn && (
          <div className="section">
            <h2>Categorization</h2>
            <Categorization file={file} column={selectedColumn} setCategorizedData={setCategorizedData} />
          </div>
        )}

        {/* Fetch Topic Distribution */}
        <div className="section">
          <button className="btn" onClick={fetchTopicDistribution}>Get Topic Distribution</button>
        </div>

        {/* Visualization Section */}
        {Object.keys(distribution).length > 0 && (
          <div className="visualization-section">
            <h2>Visualization</h2>
            <Visualization distribution={distribution} />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;



