import axios from "axios";

const API_BASE = "https://topicai-production.up.railway.app";

export const uploadFile = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return axios.post(`${API_BASE}/upload-csv`, formData);
};

export const getTopics = (file, column, nTopics, nWords) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("column_name", column);
  formData.append("n_topics", nTopics);
  formData.append("n_words", nWords);
  return axios.post(`${API_BASE}/get-topics`, formData);
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
