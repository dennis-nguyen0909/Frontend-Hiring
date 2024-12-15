// src/services/educationService.ts
import { PRIZE } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const PRIZE_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${PRIZE}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${PRIZE}`, {
      params: {
        ...params
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (resData.data) return resData.data;
    return null;
  },
  findByPrizeId: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.get(`${PRIZE}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  update: async (id:string ,body:any,accessToken: string) => {
    const res = await axiosInstance.patch(`${PRIZE}/${id}`,body ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteByUser: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.delete(`${PRIZE}/${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
