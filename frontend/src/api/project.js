import axios from "./axiosConfig";

let url = "http://localhost:8000";

export const addProject = async (data) =>
  await axios.post(`${url}/api/v1/project`, data);


export const getAllProjects = async (data) =>
  await axios.get(`${url}/api/v1/project`, data);


export const addMember = async (projectId, data) =>
  await axios.post(`${url}/api/v1/project/${projectId}/addMember`, data);
