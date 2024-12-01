// src/services/educationService.ts
import { LEVELS } from "../api/education";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const Level_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${LEVELS}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getLevelById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${LEVELS}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteManyLevels: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: 'delete',
      url: `${LEVELS}`,
      data: { ids },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  
    if (res.data) return res.data;
    return null;
  },
  update: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${LEVELS}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getLevelByUserId: async (accessToken: string, params: any) => {
    const queryParams = new URLSearchParams(params).toString(); // Serialize params to query string
    const res = await axiosInstance.get(`${LEVELS}/user?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll:async (params:any,accessToken:string)=>{
    const res = await axiosInstance.get(`${LEVELS}`,{
      params: {
        ...params
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  }
  
};
