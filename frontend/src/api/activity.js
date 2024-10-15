import axios from "./axiosConfig";

let url = "http://localhost:8000";

export const addActivity = async (data) =>
  await axios.post(`${url}/api/v1/activity`, data);
