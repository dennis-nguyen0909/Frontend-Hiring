// src/services/authService.ts
import axios from 'axios';
import { LoginData, RegisterData, VerifyCode } from '../types';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/auth/login', data,{
      withCredentials:true
    }); // Gọi API login
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng nhập thất bại');
  }
};

export const register = async (data: RegisterData) => {
  try {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};


export const verifyCode = async (data: VerifyCode) => {
  try {
    const response = await axiosInstance.post('/auth/verify', data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};
