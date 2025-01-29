import React, { useState } from "react";
import { saveLabels } from "../api";

const LabelTopics = ({ topics, setTopicLabels }) => {
    const [labels, setLabels] = useState({});
  
    const handleLabelChange = (key, value) => {
      setLabels((prev) => ({ ...prev, [key]: value }));
    };
  
    const saveTopicLabels = async () => {
      try {
        await saveLabels(labels);
        setTopicLabels(labels);  // This will now work correctly
        console.log("✅ Labels saved:", labels);
      } catch (error) {
        console.error("❌ Error saving labels:", error);
      }
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
