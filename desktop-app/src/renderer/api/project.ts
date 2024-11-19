import axios from "./axiosConfig";

let url = "http://localhost:8000";

interface ProjectData {
  name: string;
  description?: string;
  admin: string
}

interface MemberData {
  email: string
}

export const addProject = async (data: ProjectData): Promise<any> => {
  return await axios.post(`${url}/api/v1/project`, data);
};

export const getAllProjects = async (): Promise<any> => {
  return await axios.get(`${url}/api/v1/project`);
};

export const addMember = async (
  projectId: string,
  data: MemberData,
): Promise<any> => {
  return await axios.post(`${url}/api/v1/project/${projectId}/addMember`, data);
};
