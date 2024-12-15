import axios from 'axios';
import axiosInstance from './axiosInterceptor';
// Create an Axios instance for Python API
export const axiosPythonInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PYTHON_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor for requests
axiosPythonInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor for responses (optional, for global error handling)
axiosPythonInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originConfig = error.config;
    if (error.response && +error.response.data.status === 419) { // Token expired case
      try {
        // Call API to refresh token
        const res = await axiosInstance.post('/auth/refresh-token', {
          refresh_token: localStorage.getItem('refresh_token')
        });
        
        if (res.data.data && res.data.data.user) {
          const { refresh_token, access_token } = res.data.data.user;
          
          // Store new tokens
          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', refresh_token);
          
          // Update Authorization header
          originConfig.headers['Authorization'] = `Bearer ${access_token}`;
          
          // Retry the original request with the new token
          return axiosPythonInstance(originConfig);
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login'; // Redirect to login if refresh fails
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosPythonInstance;
