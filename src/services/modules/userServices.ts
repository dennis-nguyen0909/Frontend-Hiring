// src/services/authService.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export const getDetailUser = async (id: string, access_token: string) => {
    const resData = await axiosInstance.get(`/users/${id}`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      withCredentials: true
    });
  
    if (resData) return resData.data;
    return null;
  }