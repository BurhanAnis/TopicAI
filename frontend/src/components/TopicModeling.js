import React, { useState } from "react";
import { getTopics } from "../api";

const TopicModeling = ({ file, column, setTopics }) => {
  const [nTopics, setNTopics] = useState(5);
  const [nWords, setNWords] = useState(5);

  const fetchTopics = async () => {
    const response = await getTopics(file, column, nTopics, nWords);
    setTopics(response.data.topics);
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
