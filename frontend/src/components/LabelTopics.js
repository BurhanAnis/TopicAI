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
      <div className="label-container">
        <table>
          <thead>
            <tr>
              <th>Topic</th>
              <th>Words</th>
              <th>Label</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(topics).map(([key, words]) => (
              <tr key={key}>
                <td>{key}</td>
                <td>{words.join(", ")}</td>
                <td><input type="text" placeholder="Label" onChange={(e) => handleLabelChange(key, e.target.value)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn" onClick={saveTopicLabels}>Save Labels</button>
      </div>
    );
    
  };
  

export default LabelTopics;
