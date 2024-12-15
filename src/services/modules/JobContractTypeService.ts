// src/services/educationService.ts
import { JOB_CONTRACT_TYPE } from "../api/route.api";
import { axiosInstance } from "../config/axiosInterceptor"; 

// Định nghĩa EducationApi và hàm postEducation
export const JOB_CONTRACT_TYPE_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${JOB_CONTRACT_TYPE}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${JOB_CONTRACT_TYPE}/${id}`, {
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
      url: `${JOB_CONTRACT_TYPE}`,
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
    const res = await axiosInstance.patch(`${JOB_CONTRACT_TYPE}/${id}`, data, {
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
    const res = await axiosInstance.get(`${JOB_CONTRACT_TYPE}/user?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getAll:async (params:any,accessToken:string)=>{
    const res = await axiosInstance.get(`${JOB_CONTRACT_TYPE}`,{
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
