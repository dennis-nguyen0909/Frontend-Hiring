// src/services/ExperienceService.ts
import { POST_EXPERIENCE } from "../api/education"; // Đảm bảo POST_EXPERIENCE chứa đúng URL của endpoint
import { axiosInstance } from "../config/axiosInterceptor"; // Cấu hình axios

// Định nghĩa ExperienceApi và hàm postExperience
export const ExperienceApi = {
  postExperience: async (data: any, accessToken: string) => {
    const res = await axiosInstance.post(`${POST_EXPERIENCE}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getExperienceById: async (id: string, accessToken: string) => {
    const res = await axiosInstance.get(`${POST_EXPERIENCE}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  deleteManyExperience: async (ids: Array<string>, accessToken: string) => {
    const res = await axiosInstance({
      method: 'delete',
      url: `${POST_EXPERIENCE}`,
      data: { ids },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
  
    if (res.data) return res.data;
    return null;
  },
  updateExperience: async (id: string, data: any, accessToken: string) => {
    const res = await axiosInstance.patch(`${POST_EXPERIENCE}/${id}`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
  getExperienceByUserId: async (accessToken: string) => {
    const res = await axiosInstance.get(`${POST_EXPERIENCE}/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      withCredentials: true,
    });
    if (res.data) return res.data;
    return null;
  },
};
