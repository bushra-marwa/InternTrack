import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  
  // Try retrieving token from either user object or direct token key
  const finalToken = user?.token || token;
  
  if (finalToken) {
    config.headers.Authorization = `Bearer ${finalToken}`;
  }
  return config;
});

export default api;