import axios from './axiosConfig';

let url = "http://localhost:8000";

export const getCurrentUser = async (data) =>
  await axios.get(`${url}/api/v1/users/me`, data);

