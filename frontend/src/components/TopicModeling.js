import React, { useState } from "react";
import { getTopics } from "../api";

const TopicModeling = ({ file, column, setTopics }) => {
  const [nTopics, setNTopics] = useState(5);
  const [nWords, setNWords] = useState(5);
  const fetchTopics = async () => {
    try {
      const response = await getTopics(file, column, nTopics, nWords);
  
      if (!response || !response.topics) {
        console.error("❌ Error: Topics not found in API response:", response);
        alert("Failed to retrieve topics. Please check the uploaded file and column selection.");
        return;
      }
  
      console.log("✅ Topics received:", response.topics);
      setTopics(response.topics);
    } catch (error) {
      console.error("❌ API call failed:", error);
      alert("An error occurred while fetching topics. Check console for details.");
    }
  };

  return (
    <div>
      <input type="number" value={nTopics} onChange={(e) => setNTopics(e.target.value)} placeholder="Number of Topics" />
      <input type="number" value={nWords} onChange={(e) => setNWords(e.target.value)} placeholder="Words per Topic" />
      <button onClick={fetchTopics}>Get Topics</button>
    </div>
  );
};

export default TopicModeling;

