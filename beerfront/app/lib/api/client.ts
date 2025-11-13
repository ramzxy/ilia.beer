import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "https://api.ilia.beer",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 30000,
});



// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("API Error:", error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error("Network Error:", error.message);
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

