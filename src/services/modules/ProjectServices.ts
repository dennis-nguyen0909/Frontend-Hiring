// src/services/educationService.ts
import { PROJECT } from "../api/education";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const PROJECT_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${PROJECT}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${PROJECT}`, {
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
  findById: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.get(`${PROJECT}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  update: async (id:string ,body:any,accessToken: string) => {
    const res = await axiosInstance.patch(`${PROJECT}/${id}`,body ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteByUser: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.delete(`${PROJECT}/${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
