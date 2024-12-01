import axios, { InternalAxiosRequestConfig } from "axios";

axios.defaults.baseURL = "http://localhost:8000";

axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Add response interceptor for handling token expiration
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response.status === 401) {
//       localStorage.removeItem('token');
//       // Redirect to login or refresh token
//     }
//     return Promise.reject(error);
//   }
// );

export default axios;
