import axios from 'axios';

// Create an Axios instance
export const axiosPythonInstance = axios.create({
  baseURL: 'http://127.0.0.1:5000', // Your server base URL
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // If you need to send cookies with requests
});

// Add a request interceptor (optional) to include the Authorization token in all requests
axiosPythonInstance.interceptors.request.use(
  (config) => {
    // Retrieve token from localStorage or any other secure place
    const accessToken = localStorage.getItem('accessToken');
    
    if (accessToken) {
      // Add Authorization header to request if token exists
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional) to handle errors globally
axiosPythonInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default axiosPythonInstance;
