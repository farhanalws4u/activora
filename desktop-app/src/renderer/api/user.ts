import axios from "./axiosConfig";

let url = "http://localhost:8000";

interface UserData {
  _id: string;
  name: string;
  email: string;
  data:any
}

export const getCurrentUser = async (token:string): Promise<UserData> => {
  return await axios.get(`${url}/api/v1/users/me`);
};
