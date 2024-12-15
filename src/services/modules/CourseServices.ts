// src/services/educationService.ts
import { COURSE } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const COURSE_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${COURSE}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${COURSE}`, {
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
  findByCOURSEId: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.get(`${COURSE}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  update: async (id:string ,body:any,accessToken: string) => {
    const res = await axiosInstance.patch(`${COURSE}/${id}`,body ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteByUser: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.delete(`${COURSE}/${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
