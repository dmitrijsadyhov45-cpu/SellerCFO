import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDashboardMetrics = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const getAnomalies = async () => {
  const response = await api.get('/anomalies');
  return response.data;
};

export default api;
