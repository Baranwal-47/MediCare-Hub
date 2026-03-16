import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const doctorToken = localStorage.getItem("docToken");
  const receptToken = localStorage.getItem("receptToken");
  const token = doctorToken || receptToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
