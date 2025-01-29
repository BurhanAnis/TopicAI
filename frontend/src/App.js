import React, { useState } from "react";
import UploadCSV from "./components/UploadCSV";
import TopicModeling from "./components/TopicModeling";
import LabelTopics from "./components/LabelTopics";
import Categorization from "./components/Categorization";
import Visualization from "./components/Visualization";
import { getTopicDistribution } from "./api";

const App = () => {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [topics, setTopics] = useState({});
  const [categorizedData, setCategorizedData] = useState([]);
  const [distribution, setDistribution] = useState({});

  const fetchTopicDistribution = async () => {
    const response = await getTopicDistribution(selectedColumn);
    setDistribution(response.data.distribution);
  };

  return (
    <div>
      <h1>Topic Modeling App</h1>
      <UploadCSV setColumns={setColumns} />
      {columns.length > 0 && (
        <select onChange={(e) => setSelectedColumn(e.target.value)}>
          {columns.map((col) => <option key={col} value={col}>{col}</option>)}
        </select>
      )}
      <TopicModeling column={selectedColumn} setTopics={setTopics} />
      <LabelTopics topics={topics} />
      <Categorization column={selectedColumn} setCategorizedData={setCategorizedData} />
      <button onClick={fetchTopicDistribution}>Get Topic Distribution</button>
      {Object.keys(distribution).length > 0 && <Visualization distribution={distribution} />}
    </div>
  );
};

export default App;

