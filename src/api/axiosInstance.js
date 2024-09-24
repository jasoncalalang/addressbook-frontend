import axios from 'axios';
import authService from '../AuthService';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'https://ab-api.devcluster-985078-2d3fb824a69ea5c326974e87bbe5c52a-0000.jp-tok.containers.appdomain.cloud',  // Backend API URL
});

// Intercept requests to add the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await authService.getAccessToken();  // Get the access token
    console.log("Access Token");
    console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;  // Include the access token in the Authorization header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
