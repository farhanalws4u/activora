import axios from "./axiosConfig";

let url = "http://localhost:8000";

// Define the type for the data parameter
interface ActivityData {
  projectId: string;
  userId: string;
  mouseMovement: Array<{ x: number; y: number; timestamp: Date }>;
  keyboardActivity: string[];
  activeDuration: number;
  percentageActivity: number;
  screenshots: string[];
}

export const addActivity = async (data: ActivityData): Promise<any> => {
  return await axios.post(`${url}/api/v1/activity`, data);
};
