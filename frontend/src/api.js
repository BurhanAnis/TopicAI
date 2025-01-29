import axios from "axios";

const API_BASE = "https://topicai-production.up.railway.app";

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/upload-csv`, formData);
};

export const getTopics = async (file, column, nTopics, nWords) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("column_name", column);
      formData.append("n_topics", nTopics);
      formData.append("n_words", nWords);

      console.log("📤 Sending request to get topics:", {
        file,
        column,
        nTopics,
        nWords
      });

      const response = await axios.post(`${API_BASE}/get-topics`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ API Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("❌ Error in getTopics API call:", error.response?.data || error.message);
      throw error;
    }
};

  

export const saveLabels = (labels) => {
  return axios.post(`${API_BASE}/save-labels`, { labels });
};

export const categorizeResponses = (file, column) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("column_name", column);
  return axios.post(`${API_BASE}/categorize-responses`, formData);
};

export const getTopicDistribution = (file, column) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("column_name", column);
  return axios.post(`${API_BASE}/get-topic-distribution`, formData);
};
