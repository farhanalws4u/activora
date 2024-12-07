import axios, { InternalAxiosRequestConfig } from 'axios';

axios.defaults.baseURL = 'http://localhost:8000';

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('token expired.......',error.response.data)

    if (
      (error.response.data.status === "error" && error.response.data.message === 'Invalid token') ||
      (error.response.data.status === "error" && error.response.data.message === 'Please log in to access this route')
    ) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  },
);

export default axios;
