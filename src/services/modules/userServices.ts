import { axiosInstance } from "../config/axiosConfig";

// src/services/authService.ts
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