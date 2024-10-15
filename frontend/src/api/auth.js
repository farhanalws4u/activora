import axios from 'axios'

let url = 'http://localhost:8000'

export const signUp = async (data) => await axios.post(`${url}/api/v1/auth/signup`,data);

export const signIn = async (data) =>
  await axios.post(`${url}/api/v1/auth/signin`, data);