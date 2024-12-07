import axios from "./axiosConfig";

let url = "http://localhost:8000";


export const getCurrentUser = async (): Promise<any> => {
  return await axios.get(`${url}/api/v1/user/profile`);
};
