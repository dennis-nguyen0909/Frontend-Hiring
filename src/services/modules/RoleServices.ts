// src/services/educationService.ts
import { ROLES } from "../api/education"; // Đảm bảo ROLES chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const ROLE_API = {
  create: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${ROLES}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getByID: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${ROLES}/${id}`, {
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
      url: `${ROLES}`,
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
    const res = await axiosInstance.patch(`${ROLES}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getEmployerRole: async (accessToken: string) => {
    const res = await axiosInstance.get(`${ROLES}/employer`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
