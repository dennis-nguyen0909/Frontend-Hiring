// src/services/educationService.ts
import { CURRENCIES } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const CURRENCY_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${CURRENCIES}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${CURRENCIES}/${id}`, {
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
      url: `${CURRENCIES}`,
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
    const res = await axiosInstance.patch(`${CURRENCIES}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getByUserId: async (accessToken: string, params: any) => {
    const queryParams = new URLSearchParams(params).toString(); // Serialize params to query string
    const res = await axiosInstance.get(`${CURRENCIES}/user?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll:async (params:any,accessToken:string)=>{
    const res = await axiosInstance.get(`${CURRENCIES}`,{
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
