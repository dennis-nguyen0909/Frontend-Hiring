import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Interceptor yêu cầu (request)
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Xử lý lỗi yêu cầu
        return Promise.reject(error);
    }
);

// Interceptor phản hồi (response)
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originConfig = error.config;
        if (error.response && +error.response.data.status === 419) {
            try {
                const res = await axiosInstance.post('/auth/refresh-token', {
                    refresh_token: localStorage.getItem('refresh_token')
                });
                if (res.data.data && res.data.data.user) {
                    const { refresh_token, access_token } = res.data.data.user;
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
                    originConfig.headers['Authorization'] = `Bearer ${access_token}`;
                    return axiosInstance(originConfig); 
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    // window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
