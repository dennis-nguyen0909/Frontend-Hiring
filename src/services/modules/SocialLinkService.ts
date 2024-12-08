// src/services/educationService.ts
import { SOCIAL_LINKS } from "../api/education";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const SOCIAL_LINK_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${SOCIAL_LINKS}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${SOCIAL_LINKS}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteMany: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: 'delete',
      url: `${SOCIAL_LINKS}`,
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
    const res = await axiosInstance.patch(`${SOCIAL_LINKS}/${id}`, data, {
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
    const res = await axiosInstance.get(`${SOCIAL_LINKS}/user?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll:async (params:any,accessToken:string)=>{
    const res = await axiosInstance.get(`${SOCIAL_LINKS}`,{
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
