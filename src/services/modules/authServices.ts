// src/services/authService.ts
import { axiosInstance } from '../config/axiosConfig';
import { LoginData, RegisterData, VerifyCode } from '../types';

export const login = async (data: LoginData) => {
  try {
    const response = await axiosInstance.post('/auth/login', data,{
      withCredentials:true
    }); 
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

export const retryActive = async (email: string) => {
  try {
    const response = await axiosInstance.post('/auth/retry-active', {email});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Đăng ký thất bại');
  }
};
