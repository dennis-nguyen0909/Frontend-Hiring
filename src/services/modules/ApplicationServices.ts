// src/services/educationService.ts
import { APPLICATIONS } from "../api/education"; // Đảm bảo APPLICATIONS chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const API_APPLICATION = {
  createApplication: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${APPLICATIONS}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getApplicationById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${APPLICATIONS}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteManyApplication: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: 'delete',
      url: `${APPLICATIONS}`,
      data: { ids },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  
    if (res.data) return res.data;
    return null;
  },
  updateApplication: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${APPLICATIONS}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getApplicationByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${APPLICATIONS}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getApplicationByEmployerJobId: async (jobId:string,params:any,accessToken: string) => {
    const resData = await axiosInstance.get(`${APPLICATIONS}/job_id/${jobId}`, {
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
  
};
