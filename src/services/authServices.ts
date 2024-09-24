// src/services/authService.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  full_name: string;
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/auth/login', data,{
      withCredentials:true
    }); // Gọi API login
    return response.data; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại'); // Xử lý lỗi
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post('/auth/register', data); // Gọi API register
    return response.data; // Trả về dữ liệu nếu thành công
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại'); // Xử lý lỗi
  }
};
