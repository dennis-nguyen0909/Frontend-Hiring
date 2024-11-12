// src/services/educationService.ts
import { POST_EDUCATION } from "../api/education"; // Đảm bảo POST_EDUCATION chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa EducationApi và hàm postEducation
export const EducationApi = {
  postEducation: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${POST_EDUCATION}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getEducationById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${POST_EDUCATION}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteEducation: async (id: string, accessToken: string) => {
    const res = await axiosInstance.delete(`${POST_EDUCATION}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  updateEducation: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${POST_EDUCATION}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getEducationByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${POST_EDUCATION}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
