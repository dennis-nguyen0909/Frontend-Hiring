// src/services/educationService.ts
import { CERTIFICATE } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const CERTIFICATE_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${CERTIFICATE}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll: async (params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${CERTIFICATE}`, {
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
  findByCertificateId: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.get(`${CERTIFICATE}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  update: async (id:string ,body:any,accessToken: string) => {
    const res = await axiosInstance.patch(`${CERTIFICATE}/${id}`,body ,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteByUser: async (id:string ,accessToken: string) => {
    const res = await axiosInstance.delete(`${CERTIFICATE}/${id}`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
