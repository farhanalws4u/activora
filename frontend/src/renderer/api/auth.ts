import axios from "./axiosConfig";

let url = "http://localhost:8000";

interface AuthData {
  email: string;
  password: string;
}

export const signUp = async (data: AuthData): Promise<any> => {
  return await axios.post(`${url}/api/v1/auth/signup`, data);
};

export const signIn = async (data: AuthData): Promise<any> => {
  return await axios.post(`${url}/api/v1/auth/signin`, data);
};
