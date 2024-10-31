// axiosConfig.js
import axios from 'axios';

// Tạo một instance của Axios
export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// Thêm interceptor cho các yêu cầu
axiosInstance.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem('access_token'); // Hoặc bất kỳ nơi nào bạn lưu trữ token
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

// // Thêm interceptor cho các phản hồi
// axiosInstance.interceptors.response.use(
//     (response) => {
//         return response;
//     },
//     async (error) => {
//         const originalRequest = error.config;

//         // Kiểm tra nếu lỗi do token hết hạn (401 Unauthorized)
//         console.log("error",error)
//         // if (error.response.status === 401 && !originalRequest._retry) {
//         //     originalRequest._retry = true;

//         //     // Gọi API refresh token
//         //     const refreshToken = localStorage.getItem('refresh_token'); // Lấy refresh token từ storage
//         //     try {
//         //         const response = await axios.post('/auth/refresh', {
//         //             refreshToken,
//         //         });

//         //         // Lưu trữ access token mới
//         //         const { access_token } = response.data.user; // Giả sử cấu trúc dữ liệu trả về như vậy
//         //         localStorage.setItem('access_token', access_token);

//         //         // Cập nhật header cho yêu cầu gốc và thử lại
//         //         originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
//         //         return axiosInstance(originalRequest);
//         //     } catch (refreshError) {
//         //         // Xử lý lỗi khi refresh token
//         //         console.error('Refresh token failed', refreshError);
//         //         // Có thể điều hướng đến trang đăng nhập hoặc thông báo cho người dùng
//         //     }
//         // }

//         // Nếu không phải lỗi do token, trả lại lỗi
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;
