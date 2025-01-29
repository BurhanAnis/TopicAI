import React, { useState } from "react";
import { saveLabels } from "../api";

const LabelTopics = ({ topics, setTopicLabels }) => {
  const [labels, setLabels] = useState({});

  const handleLabelChange = (key, value) => {
    setLabels((prev) => ({ ...prev, [key]: value }));
  };

  const saveTopicLabels = async () => {
    await saveLabels(labels);
    setTopicLabels(labels);
  };

  return (
    <div>
      {Object.entries(topics).map(([key, words]) => (
        <div key={key}>
          <p>{key}: {words.join(", ")}</p>
          <input type="text" placeholder="Label" onChange={(e) => handleLabelChange(key, e.target.value)} />
        </div>
      ))}
      <button onClick={saveTopicLabels}>Save Labels</button>
    </div>
  );
};

export default LabelTopics;
